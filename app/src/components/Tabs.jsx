import { useState } from "react";

export function TabList({ tabs, selectIndex }) {
	const [activeIndex, setActiveIndex] = useState(selectIndex);

	return (
		<nav className="tab-list row">
			{tabs.length > 0 ? (
				tabs.map((tab, index) => (
					<button
						key={index}
						className={`tab-item ${activeIndex === index ? "active" : ""}`}
						onClick={() => setActiveIndex(index)}
					>
						{tab}
					</button>
				))
			) : (
				<span className="tab-placeholder">Aucun onglet</span>
			)}
		</nav>
	);
}
