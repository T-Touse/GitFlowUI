import { useTranslation } from "./LanguageProvider";
import "./window.css";
import { Fragment,useState } from "react"

const APPICON = <img className="app-logo" src="assets/app.svg" alt="⧟" />;

const isElectron = window && window.process && window.process.type;
const win = isElectron ? window.require("electron").remote.getCurrentWindow() : null;
const NOOP = () => { }
const minimize = win ? () => win.minimize() : NOOP
const maximize = win ? () => {
	const isMaximized = win.isMaximized();
	if (isMaximized) {
		win.unmaximize();
	} else {
		win.maximize();
	}
	setMaximized(!isMaximized)
} : NOOP
const close = win ? () => win.close() : NOOP

function ControlButton({ action, icon, title, color, look }) {
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
	const {tl} = useTranslation()
	return (
		<li className={`menu-item ${hasSubMenu ? "dropdown" : ""}`} onClick={action}>
			{tl(name)}
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
