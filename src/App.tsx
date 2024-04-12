import React, { useEffect, useState } from "react";
import "./App.css";
import NotesAPI from "./api.js";
import Sidebar from "./sidebar/Sidebar";
import EditPanel from "./editPanel/EditPanel";
import eventBus from "./EventBus";

interface Note {
	title: string;
	body: string;
	id: number;
	updated: string;
}

const App: React.FC = () => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [hasNote, setHasNote] = useState<boolean>(false);
	const updatedNotes = NotesAPI.getAllNotes();
	useEffect(() => {
		// 订阅 eventBus 中的 getNotesLength 事件
		const subscription = eventBus.on(
			"getNotesLength",
			(hasNote: boolean) => {
				console.log(hasNote, "getNotesLength?");
				setHasNote(hasNote);
			}
		);

		return () => {
			// 在组件卸载时取消订阅
			subscription.off("getNotesLength");
		};
	}, []);

	return (
		<div className="app">
			<Sidebar />
			{updatedNotes.length > 0 && <EditPanel />}
		</div>
	);
};

export default App;
