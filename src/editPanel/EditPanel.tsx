// EditPanel.tsx
import React, { useState, useEffect } from "react";
import eventBus from "../EventBus";

interface EditPanelProps {
	editNote: Note | null;
}

interface Note {
	title: string;
	body: string;
	id: number;
	updated: string;
}

const EditPanel: React.FC<EditPanelProps> = () => {
	const [selectedNote, setSelectedNote] = useState<Note>();

	useEffect(() => {
		eventBus.emit("editPanelLoaded", true);

		// 订阅 eventBus 中的 noteSelected 事件
		const subscription = eventBus.on(
			"noteSelected",
			(selectedNote: Note) => {
				console.log(selectedNote, "dsa");
				setSelectedNote(selectedNote);
			}
		);

		return () => {
			// 在组件卸载时取消订阅
			subscription.off("noteSelected");
		};
	}, []);

	// 定义处理标题输入变化的事件处理函数
	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// 更新标题状态为输入框的值
		const newTitle = event.target.value;
		setSelectedNote((prevNote: Note | any) => ({
			...prevNote,
			title: newTitle,
		}));
		eventBus.emit("noteChange", {
			...selectedNote,
			title: newTitle,
		});
	};

	// 定义处理正文输入变化的事件处理函数
	const handleBodyChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		// 更新正文状态为文本域的值
		const newBody = event.target.value;
		setSelectedNote((prevNote: Note | any) => ({
			...prevNote,
			body: newBody,
		}));
		eventBus.emit("noteChange", {
			...selectedNote,
			body: newBody,
		});
	};
	return (
		<div className="notes__preview">
			<input
				className="notes__title"
				type="text"
				value={selectedNote ? selectedNote.title : ""}
				placeholder="请输入笔记标题"
				onChange={handleTitleChange}
			/>
			<textarea
				className="notes__body"
				value={selectedNote ? selectedNote.body : ""}
				placeholder="编辑笔记"
				onChange={handleBodyChange}
			/>
		</div>
	);
};

export default EditPanel;
