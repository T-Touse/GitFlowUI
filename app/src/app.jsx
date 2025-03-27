import React,{useState} from "react"
import "./theme.css"
import { TitleBar } from "./window/TitleBar"
import { InfoBar } from "./window/InfoBar";
import { WhatSUpDocView } from "./view/WhatSUpDocView";
import { LanguageProvider } from "./window/LanguageProvider";
import { ThemeProvider } from "./window/Theme";
import { AppView } from "./view/AppView";

export function App () {
	const [theme, setTheme] = useState("dark");
	const [whatSUpDoc, setwhatSUpDoc] = useState(false);
	const appData = {
		theme,whatSUpDoc
	}
	const menu = [
		{name:"file",subMenu:[{name:"open"},null,{name:"exit"}]}
	]
	return (
		<ThemeProvider currentTheme={appData.theme||"dark"}>
			<LanguageProvider>
				<TitleBar menu={menu}/>
				{appData.whatSUpDoc?<WhatSUpDocView/>:<AppView/>}
				<InfoBar/>
			</LanguageProvider>
		</ThemeProvider>
	);
}