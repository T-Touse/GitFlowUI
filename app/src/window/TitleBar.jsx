import { Fragment,useState } from "react"
import "./window.css";
import { maximize, minimize,close } from "./controls";
import { Translate, translate } from "../utils/LanguageProvider";

const APPICON = <img className="app-logo" src="assets/app.svg" alt="⧟" />;

function ControlButton({ action, icon, title, color, look }) {
	title = translate(title)
	return (
		<button className="control-button" onClick={action}
			aria-label={title} aria-hidden={true} tabIndex={-1} data-tooltip={title} data-placement="bottom" >
			{icon}
		</button>
	);
}

function WindowControls() {
	//if(!isElectron)return <></>;
	const [isMaximized, setMaximized] = useState(false);
	const M = maximize.bind(setMaximized)
	return (
		<div className={`window-controls`}>
			<ControlButton action={minimize} icon="🗕" title="Minimize" />
			<ControlButton action={M} icon={isMaximized ? "🗗" : "🗖"} title="Maximize" />
			<ControlButton action={close} icon="🗙" title="Close" />
		</div>
	);
}

const MenuSeparator = <li className="menu-separator"><hr /></li>;

function generateMenuList(menu){
	return menu.map((item, index) =>
		item === null ? <Fragment key={index}>{MenuSeparator}</Fragment> : <MenuItem key={index} {...item} />
	)
}

function MenuItem({ name, action, subMenu }) {
	let hasSubMenu = !!subMenu;
	return (
		<li className={`menu-item ${hasSubMenu ? "dropdown" : ""}`} onClick={action}>
			<Translate value={name}/>
			{hasSubMenu && <ul className="dropdown-menu">{generateMenuList(subMenu)}</ul>}
		</li>
	);
}

function Menu({ menu = [], orientation = "column" }) {
	return (
		<ul className={`menu-list ${orientation}`}>
			{generateMenuList(menu)}
		</ul>
	);
}

export function TitleBar({ menu }) {
	return (
		<nav className="title-bar">
			{APPICON}
			<Menu menu={menu} orientation="row" />
			<WindowControls />
		</nav>
	);
}
