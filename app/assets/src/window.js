(()=>{
	function processClass(className,node){
		switch(className){
			case "menu-bar":break
			case "menu-logo":break
			case "menu-button":
				style(node,`display:block;color:#fff;text-align: center;padding: 14px 16px;text-decoration: none;`)
				style(node.hover,`display:block;color:#fff;text-align: center;padding: 14px 16px;text-decoration: none;`)
				break
			case "dropdown-menu":break
			case "menu":break
			case "dropdown":break
			case "window-controls":break
			case "control-button":break
		}
	}
	function loader(){
		const elements = document.body.querySelectorAll("[class]")
		elements.forEach(node => {
			[...node.classList||[]].forEach(clazz=>{
				processClass(clazz,node)
			})
		});
		removeEventListener("DOMContentLoaded",loader)
	}
	addEventListener("DOMContentLoaded",loader)
})();