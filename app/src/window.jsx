import React from "react";

function MenuItem({ id, children }) {
	const name = tl(`menu.${id}`);
	//{children && <ul>{children}</ul>}
	return (
		<li>
			{name}
		</li>
	);
}

const MenuSeparator = <li><hr /></li>;
export const MenuBar = <nav>
	<ul>
		<MenuItem id="file">
			<MenuItem id="file.new" />
			{MenuSeparator}
			<MenuItem id="file.add" />
			<MenuItem id="file.clone" />
			{MenuSeparator}
			<MenuItem id="options" />
			{MenuSeparator}
			<MenuItem id="exit" />
		</MenuItem>
		<MenuItem id="edit">
			<MenuItem id="edit.undo" />
			<MenuItem id="edit.redo" />
			<MenuSeparator />
			<MenuItem id="edit.cut" />
			<MenuItem id="edit.copy" />
			<MenuItem id="edit.paste" />
			<MenuItem id="edit.selectAll" />
			{MenuSeparator}
			<MenuItem id="edit.find" />
		</MenuItem>
		<MenuItem id="view"></MenuItem>
		<MenuItem id="help"></MenuItem>
	</ul>
</nav>