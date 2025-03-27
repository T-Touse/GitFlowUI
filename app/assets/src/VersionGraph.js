class GraphVersion extends HTMLElement {
	static GOLDEN_RATIO = 0.61803398875;
	static REQUEST_MERGE = "requestMerge";
	static REQUEST_NEW_BRANCH = "requestNewBranch";
	static randomColor(){
		const last = GraphVersion.randomColor.last||0
		const hue = Math.floor((last+GraphVersion.GOLDEN_RATIO * 360)%360)
		GraphVersion.randomColor.last = hue
		return `hsl(${hue}, 100%, 50%)`
	}
	static TEXT_COLOR = "#000"
	#pointerdown = false;
	#nodes = [];
	#links = new Set();
	#branches = new Map();
	#main
	get main(){
		return this.#main
	}
	reset(){
		this.#nodes.length=0;
		this.#links.clear();
		this.#branches.clear();
		this.#main = this.#createBranch(name)
	}

	constructor() {
		super();
		const root = this.attachShadow({ mode: "open" })
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		root.innerHTML = `<style>:host{display:block;overflow:scroll;}canvas{filter: drop-shadow(1px 2px 2px #2228);}</style>`;
		root.appendChild(this.canvas);
		let dragLink;
		this.canvas.addEventListener("dblclick", (ev) => this.#select(this.#get(ev)));
		this.canvas.addEventListener("pointerdown", () => this.#pointerdown = true);
		this.canvas.addEventListener("pointerup", (ev) => {
			this.#pointerdown = false
			if (dragLink){
				const node = this.#get(ev)
				const baseBranch = dragLink.nodeA.getBranch()
				if(node){//merge
					const branch = node.getBranch()
					this.dispatchEvent(new CustomEvent(GraphVersion.REQUEST_MERGE,{detail:{baseBranch:branch,branch:baseBranch}}))
				}else{//new branch
					this.dispatchEvent(new CustomEvent(GraphVersion.REQUEST_NEW_BRANCH,{detail:{baseBranch}}))
				}
				dragLink = dragLink.delete() && null;
			}
			this.render()
		});
		this.canvas.addEventListener("pointermove", (ev) => {
			const node = this.#get(ev)
			if (this.#pointerdown) {
				if (!dragLink && node)
					dragLink = this.#createDragLink(node)
				this.#drag(ev, dragLink);
			} else if(node){
				this.#hover();
			}
		});

		window.addEventListener("resize", () => this.#resizeCanvas());
		this.#main = this.#createBranch("main")
		this.#resizeCanvas();
	}
	connectedCallback(){
		this.#resizeCanvas();
		GraphVersion.TEXT_COLOR = getComputedStyle(this.parentElement).color
	}
	#maxX = 0
	#maxY = 0
	#resizeCanvas() {
		this.canvas.width = Math.max(this.#maxX+3*GraphVersion.Node.SPACING, 256, this.clientWidth);
		this.canvas.height = Math.max(this.#maxY+2*GraphVersion.Node.SPACING, 256, this.clientHeight);
		this.render();
	}

	#get(ev) {
		const { offsetX, offsetY } = ev;
		return this.#nodes.find(node => node.contains(offsetX, offsetY));
	}
	#createDragLink(node) {
		if(!node.isLast)return
		const link = new GraphVersion.DragLink(node)
		this.#links.add(link)
		link.delete = () => {
			this.#links.delete(link)
		}
		return link
	}

	#select(node) {
		if (node) {
			this.#nodes.forEach(n => n.isSelected = false);
			node.isSelected = true;
			this.render();
		}
	}

	#hover(node) {
		this.#nodes.forEach(n => n.isHover = false);
		if (node) node.isHover = true;
		this.render();
	}

	#drag(event, node) {
		if (node) {
			node.x = event.offsetX;
			node.y = event.offsetY;
			this.render();
		}
	}
	#maxRow = 0
	#createBranch(name,fromBranch){
		if(this.#branches.has(name))
			return this.#branches.get(name)
		let row = Math.max(fromBranch?.x||0,this.#maxRow-3)
		this.#maxRow = Math.max(row,this.#maxRow)
		let branch;
		branch = new GraphVersion.Branch({
			name,
			color:GraphVersion.randomColor(),
			last:{row,col:this.#branches.size+1},
			node:(last,branch)=>this.#addNode(last.row + 1, last.col, branch),
			link:(last,next)=>{this.#addLink(last,next);},
			branch:(name,branch)=>this.#createBranch(name,branch),
			render:()=>{this.render();}
		})
		this.#branches.set(name,branch)
		return branch
	}

	#addNode(x, y, branch) {
		const node = new GraphVersion.Node(x, y, branch);
		let needUpdate = false
		if(node.x > this.#maxX){
			this.#maxX = node.x
			needUpdate = true
		}
		if(node.y > this.#maxY){
			this.#maxY = node.y
			needUpdate = true
		}
		if(needUpdate)
			this.#resizeCanvas()
		this.#nodes.push(node);
		console.log(this.scrollLeftMax,this.scrollX)
		this.scrollTo(this.scrollLeftMax,0)
		return node
	}

	#addLink(nodeA, nodeB) {
		this.#links.add(new GraphVersion.Link(nodeA, nodeB));
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.#branches.forEach(branch => branch.render(this.ctx));
		this.#links.forEach(link => link.render(this.ctx));
		this.#nodes.forEach(node => node.render(this.ctx));
	}
}

GraphVersion.Branch = class {
	#last
	get x(){return this.#last.row}
	get y(){return this.#last.col}
	#node
	#link
	#branch
	#render
	constructor(data = {}){
		this.name = data.name
		this.color = data.color||"#888"
		this.#last = data.node(data.last,this)
		this.#node = data.node
		this.#link = data.link
		this.#branch = data.branch
		this.#render = data.render
	}
	branch(name){
		const branch = this.#branch?.(name,this)
		this.#link(this.#last,branch.#last)
		return branch
	}
	commit(message){
		const node = this.#node(this.#last,this)
		this.#link(this.#last,node)
		node.name = message
		this.#last = node
	}
	merge(branch){
		if(branch == this)throw `can't merge itself`
		const row = Math.max(branch.x,this.x)
		const col = this.y
		const node = this.#node({row,col},this)
		this.#link(this.#last,node)
		this.#link(branch.#last,node)
		this.#last = node
	}
	isLast(node){
		return this.#last == node
	}
	render(ctx) {
		const x = ctx.canvas.width;
		const y = this.y * GraphVersion.Node.SPACING;
		ctx.strokeStyle = "#222"
		ctx.globalAlpha = .8
		ctx.beginPath()
		ctx.lineWidth = 2
		ctx.moveTo(0,y)
		ctx.lineTo(x,y)
		ctx.stroke()
		ctx.translate(x, y)
		ctx.globalAlpha = 1
		ctx.fillStyle = GraphVersion.TEXT_COLOR
		if(this.name){
			ctx.font = "16px serif";
			const tm = ctx.measureText(this.name)
			const dx = tm.width||0
			ctx.fillText(this.name,-dx,-5)
		}
		ctx.translate(-x, -y)
	}
}
GraphVersion.Node = class {
	static RADIUS = 8;
	static SPACING = 50;
	static LINEWIDTH = 3;
	static SCALE = 10
	static HOVER_RADIUS = 5
	static HOVER_SCALE = 25
	#branch
	get color(){
		return this.#branch.color
	}
	get isLast(){
		return this.#branch.isLast(this)
	}
	hasSameBranch(node){
		return this.#branch == node
	}
	getBranch(){
		return this.#branch
	}
	constructor(x, y, branch) {
		this.x = x * GraphVersion.Node.SPACING
		this.y = y * GraphVersion.Node.SPACING
		this.row = x;
		this.col = y;
		this.#branch = branch;
		this.isSelected = false;
		this.isHover = false;
	}
	contains(px, py) {
		const x = this.x;
		const y = this.y;
		return Math.hypot(x - px, y - py) < GraphVersion.Node.RADIUS * 2;
	}
	#circle(ctx, r, s) {
		const c = s / 2;
		const d = Math.min(s, r)/2;
		const b = c - d
		ctx.beginPath()
		ctx.moveTo(c, -b)
		ctx.lineTo(c, b)
		ctx.quadraticCurveTo(c, c, b, c)
		ctx.lineTo(-b, c)
		ctx.quadraticCurveTo(-c, c, -c, b)
		ctx.lineTo(-c, -b)
		ctx.quadraticCurveTo(-c, -c, -b, -c)
		ctx.lineTo(b, -c)
		ctx.quadraticCurveTo(c, -c, c, -b)
		ctx.fillStyle = this.isSelected ? "black" : this.color;
		ctx.fill();
		ctx.strokeStyle = "white";
		ctx.lineWidth = GraphVersion.Node.LINEWIDTH;
		ctx.stroke();
	}
	render(ctx) {
		const x = this.x;
		const y = this.y;
		ctx.translate(x, y)
		if (this.isHover) {
			this.#circle(ctx, GraphVersion.Node.HOVER_RADIUS, GraphVersion.Node.HOVER_SCALE)
		} else if (this.isSelected) {
			this.#circle(ctx, GraphVersion.Node.RADIUS, GraphVersion.Node.SCALE)
		}{
			this.#circle(ctx, GraphVersion.Node.RADIUS, GraphVersion.Node.SCALE)
		}
		ctx.fillStyle = GraphVersion.TEXT_COLOR
		if(this.name){
			ctx.font = "16px serif";
			const tm = ctx.measureText(this.name)
			const dx = tm.width||0
			const dy = tm.emHeightAscent||0
			const s = this.row%2?2:-1
			ctx.fillText(this.name,-dx/2,(dy)*s)
		}
		ctx.translate(-x, -y)
	}
};
GraphVersion.Link = class {
	static LINEWIDTH = 10
	constructor(nodeA, nodeB) {
		this.nodeA = nodeA;
		this.nodeB = nodeB;
	}
	#bezier(ctx, x, y, a, b) {
		const w = Math.min(a, x) + Math.abs(x - a) / 2
		ctx.moveTo(x, y)
		ctx.bezierCurveTo(w, y, w, b, a, b)
	}
	render(ctx) {
		const gradient = ctx.createLinearGradient(this.nodeA.x, this.nodeA.y, this.nodeB.x, this.nodeB.y);
		try{
			gradient.addColorStop(0, this.nodeA.color);
			gradient.addColorStop(1, this.nodeB.color);
		}catch(err){
			console.error(this.nodeA.color,this.nodeB.color)
			gradient.addColorStop(0, "#eee");
			gradient.addColorStop(1, "#222");
		}

		ctx.beginPath();
		if (this.nodeA.hasSameBranch(this.nodeB)) {
			ctx.moveTo(this.nodeA.x, this.nodeA.y);
			ctx.lineTo(this.nodeB.x, this.nodeB.y);
		} else {
			this.#bezier(ctx, this.nodeA.x, this.nodeA.y, this.nodeB.x, this.nodeB.y)
		}
		ctx.strokeStyle = gradient;
		ctx.lineWidth = GraphVersion.Link.LINEWIDTH;
		ctx.stroke();
	}
};
GraphVersion.DragLink = class extends GraphVersion.Link {
	set x(x) { this.nodeB.x = x }
	set y(y) { this.nodeB.y = y }
	constructor(node) {
		super(node, {
			x: node.x,
			y: node.y,
			color: "#222",
			branch: null,
		})
	}
	#arrow(ctx){
		const w = GraphVersion.Link.LINEWIDTH
		const c = GraphVersion.Node.RADIUS + w / 2;
		const d = Math.min(c, w) / 2;
		ctx.beginPath()
		ctx.moveTo(d, 0)
		ctx.lineTo(0, c)
		ctx.lineTo(-w, c)
		ctx.lineTo(-d, 0)
		ctx.lineTo(-w, -c)
		ctx.lineTo(0, -c)
		ctx.fillStyle = this.nodeB.color;
		ctx.fill()
	}
	render(ctx) {
		super.render(ctx)
		const x = this.nodeB.x
		const y = this.nodeB.y
		const dx = this.nodeB.x - this.nodeA.x
		const dy = this.nodeB.y - this.nodeA.y
		const a = Math.atan2(dy,dx)
		ctx.translate(x, y)
		ctx.rotate(a)
		this.#arrow(ctx)
		ctx.rotate(-a)
		ctx.translate(-x, -y)
		ctx.strokeStyle = "white";
		ctx.lineWidth = GraphVersion.Node.LINEWIDTH;
		ctx.stroke();
	}
}

customElements.define("graph-version", GraphVersion);
