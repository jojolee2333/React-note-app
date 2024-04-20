import React from "react";
import "./ListItem.css";
import { Note } from "../interfaces";

interface ListItemProps extends Note {
	onItemClick: (id: number) => void;
	onItemDbClick: (id: number) => void;
	active: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
	id,
	title,
	body,
	updated,
	onItemClick,
	onItemDbClick,
	active,
}) => {
	const MAX_BODY_LENGTH = 60;

	return (
		<div
			className={`notes__list-item ${
				active ? "notes__list-item--selected" : ""
			}`}
			data-note-id={id}
			onDoubleClick={() => onItemDbClick(id)}
			onClick={() => onItemClick(id)} // 当笔记项被点击时调用onItemClick函数，并将id作为参数传递
		>
			<div className="notes__small-title">{title}</div>
			<div className="notes__small-body">
				{body.substring(0, MAX_BODY_LENGTH)}
				{body.length > MAX_BODY_LENGTH ? "..." : ""}
			</div>
			<div className="notes__small-updated">
				{new Date(updated).toLocaleString(undefined, {
					dateStyle: "full",
					timeStyle: "short",
				})}
			</div>
		</div>
	);
};

export default ListItem;
