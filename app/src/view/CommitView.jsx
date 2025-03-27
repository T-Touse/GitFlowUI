export function CommitView() {
	const commits = [
		{ message: "Fix bug", author: "Alice" },
		{ message: "Add new feature", author: "Bob" },
		{ message: "Refactor code", author: "Charlie" },
	];

	return (
		<div className="commit-view">
			<h2>Commits</h2>
			<ul>
				{commits.map((commit, index) => (
					<li key={index}>
						<strong>{commit.message}</strong> - {commit.author}
					</li>
				))}
			</ul>
		</div>
	);
}
