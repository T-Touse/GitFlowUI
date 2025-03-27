import "./grid.css";

// 🔹 Définition des positions disponibles
const POSITIONS = {
	NW: "grid-nw",
	N: "grid-n",
	NE: "grid-ne",
	W: "grid-w",
	C: "grid-c",
	E: "grid-e",
	SW: "grid-sw",
	S: "grid-s",
	SE: "grid-se",
};

// Fonction pour créer une pose
Grid.createPose = function (position) {
	return POSITIONS[position] || POSITIONS.C; // Retourne "C" par défaut si inconnu
};

// Raccourcis pour chaque position
Object.keys(POSITIONS).forEach((key) => {
	Grid[key] = Grid.createPose(key);
});

// 🔹 Composant Grid
export function Grid({ children }) {
	return (<div className="grid">{children}</div>);
}

// 🔹 Composant GridItem pour placer un élément dans la grille
export function GridItem({ children, pose }) {
	const className = `grid-item ${pose}`;
	return <div className={className}>{children}</div>;
}
