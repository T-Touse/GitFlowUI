import { useState, useEffect } from "react";
import { Icon } from "../utils/Icon";

// 🔹 Composant réutilisable pour input de recherche
function SearchInput({ name, ...rest }) {
	const id = crypto.randomUUID();
	return <input type="search" id={id} name={name || "search"} {...rest} />;
}

// 🔹 Barre de recherche avec suggestions (ex: recherche de tags)
export function SearchBar({ name, placeholder, suggestions = [] }) {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
	const listId = crypto.randomUUID();

	const handleChange = (value) => {
		setQuery(value);
		setLoading(true);

		// Filtrage des suggestions
		if (value.length) {
			const searchQuery = value.toUpperCase();
			setFilteredSuggestions(
				suggestions.filter((x) => x.toUpperCase().includes(searchQuery))
			);
		} else {
			setFilteredSuggestions(suggestions);
		}

		// Simule un délai pour le chargement
		setTimeout(() => setLoading(false), 300);
	};

	const handleClear = () => {
		setQuery("");
		setFilteredSuggestions(suggestions);
	};

	return (
		<div className="input">
			<SearchInput
				placeholder={placeholder}
				value={query}
				onChange={(e) => handleChange(e.target.value)}
				list={listId}
				name={name}
			/>
			{loading ? <Icon icon="spinner-alt" className="loading" /> : null}
			<Icon icon="search" />
			{query && <Icon icon="close" onClick={handleClear} className="clear" />}

			{/* Datalist pour suggestions */}
			<datalist id={listId}>
				{filteredSuggestions.map((suggestion, index) => (
					<option key={index} value={suggestion} />
				))}
			</datalist>
		</div>
	);
}

export function SearchList({ get, template, items = [], placeholder }) {
	// Définit la fonction de récupération et le template par défaut si non fournis
	if (!get) {
		get = async (value) =>
			items.filter((item) =>
				item.toLowerCase().includes(value.toLowerCase())
			);
	}
	if (!template) {
		template = ({ value }) => <>{value}</>;
	}

	const Builder = template;
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [filteredItems, setFilteredItems] = useState([]);

	// Exécute `get()` uniquement au chargement initial
	useEffect(() => {
		setLoading(true);
		Promise.resolve(get(""))
			.then((data) => setFilteredItems(data))
			.finally(() => setLoading(false));
	}, []); // <-- Exécute ce code une seule fois au montage du composant

	const handleChange = async (value) => {
		setQuery(value);
		setLoading(true);

		// Filtrage dynamique des fichiers/dossiers
		const newFilteredItems = await get(value);

		setFilteredItems(newFilteredItems);
		setLoading(false);
	};

	const handleClear = () => {
		setQuery("");
		handleChange(""); // Remet la liste initiale
	};

	return (
		<div className="column">
			<div className="input">
				<SearchInput
					placeholder={placeholder}
					value={query}
					onChange={(e) => handleChange(e.target.value)}
				/>
				{loading && <Icon icon="spinner-alt" className="loading" />}
				{query && <Icon icon="close" onClick={handleClear} className="clear" />}
			</div>
			{/* Affichage des résultats */}
			<div className="column list-inner">
				{filteredItems.length > 0 ? (
					filteredItems.map((item, index) => <Builder key={index} value={item} />)
				) : (
					<div>Aucun résultat trouvé</div>
				)}
			</div>
		</div>
	);
}