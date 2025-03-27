import React,{useState} from "react"
import "./info-bar.css"
import { Translate } from "../utils/LanguageProvider"

export function InfoBar({  }) {
	const [status, setStatus] = useState({ loading: false, message: "" })
	const [stats, setStats] = useState({ repos: 3, files: 124 })

	return (
		<footer className="info-bar">
			{/* Statistiques générales */}
			<div className="info-item">
				<strong><Translate value="repo"/> :</strong> {stats.repos}
			</div>
			<div className="info-item">
				<strong><Translate value="file.followed"/> :</strong> {stats.files}
			</div>

			{/* Action en cours */}
			<div className="info-status">
				{status.loading ? (
					<>
						<img src="/assets/loader.svg" />
						<span>{status.message}</span>
					</>
				) : (
					<span><Translate value={status.message || "ready"}/></span>
				)}
			</div>
		</footer>
	)
}
