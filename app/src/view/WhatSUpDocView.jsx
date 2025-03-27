import { RepoList } from "../components/RepoList"
import { useTranslation } from "../utils/LanguageProvider"
import "./whatsup.css"

function Button({ label, onClick }) {
	const { tl } = useTranslation()
	return (
		<button className="whatsup-btn" onClick={onClick}>
			{tl(label)}
		</button>
	)
}
export function WhatSUpDocView() {
	const { tl } = useTranslation()
	return (
		<section className="whatsup row gap-4">
			<div className="w-6 column gap-2">
				<RepoList />
			</div>
			<div className="w-6 column gap-2">
			<h1>{tl("lets_starting")}</h1>
				<p className="subtitle">{tl("lets_starting.subtitle")}</p>
				<div className="column gap-2 mt-4">
					<Button label="file.new" onClick={() => console.log("Créer un dépôt")} />
					<Button label="file.add" onClick={() => console.log("Ouvrir un dépôt")} />
					<Button label="file.clone" onClick={() => console.log("Cloner un dépôt")} />
					<Button label="options" onClick={() => console.log("Ouvrir les paramètres")} />
				</div>
				<div className="dashed bottom">
					<h2>{tl("tips")}</h2>
					<p>

					</p>
				</div>
			</div>
		</section>
	)
}