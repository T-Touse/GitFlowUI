import { watch, type FSWatcher } from "original-fs"
import { git } from "./cmd"
import type { IBranch, IDistantBranch, IGit, IRepository } from "./Igit"
function deBounce(callback:Function,delay = 1000){
	let last = 0
	return (...args:any[])=>{
		if(Date.now()-last>delay){
			last = Date.now()
			return callback(args)
		}
	}
}

export class Git implements IGit{
	#repositories:Set<Repositor> = new Set()
	async init(dir: string): Promise<IRepository> {
		const repo = Repositor.fromDir(dir)
		this.#repositories.add(repo)
		return repo;
	}
	async clone(url: string,dir:string): Promise<IRepository> {
		const repo = Repositor.fromURL(url,dir)
		this.#repositories.add(repo)
		return repo
	}
	async repositories(query?: string): Promise<IRepository[]> {
		return [...this.#repositories.values()];
	}
	static fromEmail(email:string){
		git.config("user.email",email)
	}
	static fromName(name:string){
		git.config("user.name",name)
	}
}

class Repositor implements IRepository{
	#dir:string
	#branchs:Set<Branch> = new Set()
	#currentBranch:Branch|null = null;
	constructor(dir:string){
		this.#dir = dir
		git.cd(dir);
	}
	main:IBranch
	branches(): Promise<IBranch[]> {
		return [...this.#branchs.values()]
	}
	open(){
		this.watch()
	}
	#watcher:FSWatcher|null = null
	watch(){
		if(this.#watcher)return
		const listener = deBounce(this.#onFileModification)
		this.#watcher = watch(this.#dir,{recursive:true},listener)
	}
	#onFileModification(){
		git.status()
	}
	static fromDir(dir:string){
		git.cd(dir);
		git.init();
		return new Repositor(dir)
	}
	static fromURL(url:string,dir:string){
		git.cd(dir);
		git.clone(url);
		return new Repositor(dir)
	}
}

class Branch implements IBranch{
	#repo
	#name
	get name(){
		return this.#name
	}
	#check(){
		if(!this#repo.isCurrent(this))
			git.checkout(message)
	}
	commit(message:string){
		this.#check()
		git.commit(message)
	}
	push(){
		this.#check()
		git.push()
	}
	merge(branch:Branch){
		this.#check()
		git.merge(branch.name)
	}
}