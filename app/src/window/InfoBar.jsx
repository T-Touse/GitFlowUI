import React,{useState} from "react"
import "./info-bar.css"

export function InfoBar({  }) {
	const [status, setStatus] = useState({ loading: false, message: "" })
	const [stats, setStats] = useState({ repos: 3, files: 124 })

	return (
		<footer className="info-bar">
			{/* Statistiques générales */}
			<div className="info-item">
				<strong>Dépôts :</strong> {stats.repos}
			</div>
			<div className="info-item">
				<strong>Fichiers suivis :</strong> {stats.files}
			</div>

			{/* Action en cours */}
			<div className="info-status">
				{status.loading ? (
					<>
						<img src="/assets/loader.svg" />
						<span>{status.message}</span>
					</>
				) : (
					<span>{status.message || "Prêt"}</span>
				)}
			</div>
		</footer>
	)
}
