import { createRoot } from "react-dom/client";
import { App } from "./app";

document.addEventListener("DOMContentLoaded", () => {
	let root = createRoot(document.getElementById("root"));
	console.log(root)
	root.render(<App />);
});