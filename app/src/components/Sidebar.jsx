import {createContext,useContext,useState} from "react"
import { Icon } from "../utils/Icon"
const SIDEBAR = createContext()

export function HasSidebar({children}){
	const [show,setShow] = useState(true)
	const handler = ()=>{
		setShow(!show)
	}
	return <SIDEBAR.Provider value={{handler,show}}>
		{children}
	</SIDEBAR.Provider>
}
export function SidebarMenu({children}){
	const {show} = useContext(SIDEBAR)
	return (<div className={"sidebar " + (show ?"show":"")}>
			{children}
		</div>);
}
export function SidebarButton({onClick,children,...rest}){
	const {handler} = useContext(SIDEBAR)
	const handleClick = (ev)=>{
		handler(ev)
		onClick?.(ev)
	}
	if(!children){
		children = <Icon icon="menu"/>
	}
	return <button onClick={handleClick} {...rest}>{children}</button>
}