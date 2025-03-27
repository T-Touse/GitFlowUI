import React, { createContext, useState, useEffect, useContext } from "react"

const ThemeContext = createContext()

// Détection du mode dark/light du système
function getSystemTheme() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

// Détection du système d'exploitation
function getOSTheme() {
	const platform = navigator.platform.toLowerCase()
	if (platform.includes("win")) return "win"
	if (platform.includes("mac")) return "darwin"
	return "unix"
}

export function ThemeProvider({ children }) {
	// États des thèmes
	const [theme, setTheme] = useState(getSystemTheme())
	const [osTheme] = useState(getOSTheme())

	// Mise à jour automatique si l'utilisateur change le mode système
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		const handleChange = () => setTheme(mediaQuery.matches ? "dark" : "light")

		mediaQuery.addEventListener("change", handleChange)
		return () => mediaQuery.removeEventListener("change", handleChange)
	}, [])

	// Appliquer le bon thème au `data-theme`
	useEffect(() => {
		document.documentElement.dataset.theme = theme
		document.documentElement.dataset.os = osTheme
	}, [theme, osTheme])

	// Permet de changer le thème
	const toggleTheme = () => {
		setTheme((prev) => (prev === "dark" ? "light" : "dark"))
	}

	return (
		<ThemeContext.Provider value={{ theme, osTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	return useContext(ThemeContext)
}
