import { useState, useEffect } from "react";

function FileListItem({ file }) {
	return (
		<li className="flex justify-between p-2 border-b border-gray-300">
			<span>{file.name}</span>
			<span className={`px-2 py-1 rounded text-white ${file.status === "M" ? "bg-yellow-500" :
					file.status === "A" ? "bg-green-500" :
						"bg-red-500"
				}`}>
				{file.status === "M" ? "Modifié" : file.status === "A" ? "Ajouté" : "Supprimé"}
			</span>
		</li>
	);
}

function FileList() {
	const [files, setFiles] = useState([]);

	useEffect(() => {
		// Simuler une récupération des fichiers avec `git status --porcelain`
		const mockFiles = [
			{ name: "index.js", status: "M" },
			{ name: "style.css", status: "A" },
			{ name: "old_script.js", status: "D" }
		];
		setFiles(mockFiles);
	}, []);

	return (
		<div className="p-4 bg-gray-100 rounded-lg shadow">
			<h2 className="text-lg font-bold mb-2">Fichiers modifiés</h2>
			<ul>
				{files.length > 0 ? (
					files.map((file, index) => <FileListItem key={index} file={file} />)
				) : (
					<li className="text-gray-500">Aucun fichier modifié</li>
				)}
			</ul>
		</div>
	);
}

export default FileList;
