import React, { useContext, useEffect } from "react";
import NotesAPI from "../api.js";
import "./Sidebar.css";
import { useState } from "react";
import ListItem from "../listItem/ListItem";
import ImportButton from "../importButton/ImportButton";
import ExportButton from "../exportButton/ExportButton";
import eventBus from "../EventBus";
import { Note } from "../interfaces";

interface Props {
	notes: Note[];
	activeNoteId: number | null;
}

const Sidebar: React.FC<Props> = () => {
	useEffect(() => {
		// 订阅 eventBus 中的 noteChange 事件
		const subscription = eventBus.on("noteChange", (selectedNote: Note) => {
			NotesAPI.saveNote(selectedNote);
			_refreshNotes();
		});

		_refreshNotes();

		return () => {
			// 在组件卸载时取消订阅
			subscription.off("noteChange");
		};
	}, []);

	const [notes, setNotes] = useState<Note[]>([]);
	const [activeNoteId, setActiveNoteId] = useState<Number>();

	// 点击选择笔记
	function onNoteSelect(noteId: number) {
		const selectedNote: Note | undefined = notes.find(
			(note) => note.id === Number(noteId)
		);

		if (selectedNote) {
			console.log(selectedNote, "selectedNote");

			setActiveNoteId(selectedNote.id);
			_setActiveNote(selectedNote);
		}
	}

	// 点击新建笔记
	function onNoteAdd() {
		const newNote: Note = {
			title: "新建笔记",
			body: "开始记录...",
			id: -1,
			updated: "",
		};

		NotesAPI.saveNote(newNote);
		_refreshNotes();
	}

	function onNoteImport() {
		_refreshNotes();
	}

	// 重新加载笔记列表
	function _refreshNotes() {
		const updatedNotes = NotesAPI.getAllNotes();
		setNotes(updatedNotes);

		if (updatedNotes.length > 0) {
			setActiveNoteId(updatedNotes[0].id);
			_setActiveNote(updatedNotes[0]);
			eventBus.emit("getNotesLength", true);
		} else {
			eventBus.emit("getNotesLength", false);
		}
	}

	// 激活选中的笔记
	function _setActiveNote(selectedNote: Note) {
		console.log(selectedNote, "_setActiveNote");

		// 更新右侧笔记详情视图
		setTimeout(() => {
			eventBus.emit("noteSelected", selectedNote);
		}, 0);
	}

	// 双击笔记item
	function onItemDbClick(id: number) {
		const doDelete = confirm("确认要删除该笔记吗?");
		if (doDelete) {
			deleteNote(id);
		}
	}

	// 删除笔记
	function deleteNote(noteId: number) {
		NotesAPI.deleteNote(noteId);
		_refreshNotes();
	}

	const exportNotes = () => {
		const notes = localStorage.getItem("notesapp-notes");
		if (notes) {
			const csvData = convertToCSV(JSON.parse(notes));
			const blob = new Blob([csvData], {
				type: "text/csv;charset=utf-8",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "notes.csv";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	};

	const convertToCSV = (data: any[]) => {
		const csvContent = data
			.map((row) => Object.values(row).join(","))
			.join("\n");
		return csvContent;
	};

	return (
		<>
			<div className="notes__sidebar">
				<button
					className="notes__add"
					onClick={onNoteAdd}
					type="button"
				>
					添加新的笔记 📒
				</button>
				<ImportButton noteParseSuccess={onNoteImport}></ImportButton>
				<ExportButton onClick={exportNotes} />
				<div className="notes__list">
					{notes.map((note) => (
						<ListItem
							key={note.id}
							id={note.id}
							title={note.title}
							body={note.body}
							updated={note.updated}
							onItemDbClick={onItemDbClick}
							onItemClick={onNoteSelect}
							active={note.id === activeNoteId}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default Sidebar;
