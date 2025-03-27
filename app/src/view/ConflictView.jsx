export function ConflictView() {
	const conflicts = [
		{ file: "index.js", status: "Conflit détecté" },
		{ file: "style.css", status: "Résolu" },
	];

	return (
		<div className="conflict-view">
			<h2>Conflits</h2>
			<ul>
				{conflicts.map((conflict, index) => (
					<li key={index}>
						{conflict.file} - <span>{conflict.status}</span>
					</li>
				))}
			</ul>
		</div>
	);
}