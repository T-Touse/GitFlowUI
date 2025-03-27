import React, { createContext, useState, useEffect, useContext, useMemo } from "react"

const LanguageContext = createContext()

async function loadLanguageFile(lang) {
	try {
		const res = await fetch(`assets/lang/${lang}.ini`)
		if (!res.ok) throw new Error(`${lang} not found`)
		const text = await res.text()
		const newTranslations = {}

		const matches = text.matchAll(/((\w|\.)+)\s*=(.*)\n?/g) || []
		for (const match of matches) {
			const [_, key, __, value] = match
			newTranslations[key] = value.trim()
		}
		return newTranslations
	} catch (err) {
		throw err
	}
}

export function LanguageProvider({ children }) {
	const [lang, setLang] = useState(navigator.language || "en")
	const [translations, setTranslations] = useState({})

	useEffect(() => {
		async function loadLanguage(lang) {
			try {
				const newTranslations = await loadLanguageFile(lang)
				setTranslations(newTranslations)
				console.log(`language change for "${lang}"`)
			} catch (error) {
				console.error(`Error loading ${lang}:`, error)
				if (lang !== "en") loadLanguageFile("en")
			}
		}

		loadLanguage(lang)
	}, [lang])

	const changeLanguage = (newLang) => setLang(newLang)

	return (
		<LanguageContext.Provider value={{ tl: (key) => translations[key] || key, changeLanguage }}>
			{children}
		</LanguageContext.Provider>
	)
}

export function useTranslation() {
	return useContext(LanguageContext);
}

export function Translate({ value }) {
	const { tl } = useContext(LanguageContext);
	return <>{tl(value)}</>;
}

// Fonction de traduction globale
export function translate(value) {
	const context = useContext(LanguageContext);
	return context?.tl(value) || value; // Si tl n'est pas dispo, retourne la valeur brute
}