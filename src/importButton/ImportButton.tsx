import React from "react";
import NotesAPI from "../api.js";
import { Note } from "../interfaces.js";

interface ImportButtonProps {
	handleFileUpload: () => void; // 点击按钮时的事件处理函数
	noteParseSuccess: () => void;
}

const ImportButton: React.FC<ImportButtonProps> = ({ noteParseSuccess }) => {
	// 处理上传的文件
	const handleFileUpload = (file: Blob) => {
		const reader = new FileReader();

		// 当文件加载完成时触发该事件
		reader.onload = (event) => {
			const fileContent = event.target.result;

			// 对文件内容进行解析
			let parsedArr = parseCSV(fileContent) || [];
			console.log(parsedArr, "parsedArr");

			parsedArr.map((noteItem) => {
				const newNote: Note = {
					title: noteItem[0],
					body: noteItem[1],
					id: noteItem[2] ? noteItem[2] : -1,
					updated: noteItem[3] ? noteItem[3] : "",
				};
				NotesAPI.saveNote(newNote);
			});
			noteParseSuccess();
		};

		// 开始读取文件
		reader.readAsText(file);
	};

	// 解析 CSV 格式的数据
	const parseCSV = (csv: string | any, columnDelimiter = ",") => {
		if (csv === null) {
			return;
		}
		const table = csv.trim().replace(/\r\n?/g, "\n");
		console.log(table, "table?");

		let quoteCounter = 0;
		let lastDelimiterIndex = 0;
		let arrTable = [[]];
		let anchorRow: string[] = arrTable[arrTable.length - 1];
		for (let i = 0; i < table.length; i++) {
			const char = table[i];
			if (char === '"' && table[i - 1] !== "\\") {
				quoteCounter = quoteCounter ? 0 : 1;
				if (quoteCounter) {
					lastDelimiterIndex = i + 1;
				}
			} else if (
				!quoteCounter &&
				(char === columnDelimiter ||
					char === "\n" ||
					i === table.length - 1)
			) {
				const startPos = lastDelimiterIndex;
				let col = startPos >= i ? "" : table.slice(startPos, i).trim();
				if (col[col.length - 1] === '"') {
					col = col.slice(0, col.length - 1);
				}
				anchorRow.push(col);
				lastDelimiterIndex = i + 1;
				if (char === "\n") {
					anchorRow = arrTable[arrTable.push([]) - 1];
				}
			}
		}
		console.log(arrTable, "arrTable");

		return arrTable;
	};

	// 上传文件的事件处理函数
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileList = event.target.files;
		if (fileList && fileList.length > 0) {
			const selectedFile = fileList[0];
			handleFileUpload(selectedFile);
		}
	};

	return (
		<>
			<input
				type="file"
				id="file-input"
				accept=".csv, .xml" // 可以根据需要添加其他格式
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>
			<button
				className="notes__add"
				onClick={() => document.getElementById("file-input")?.click()}
			>
				Import Notes
			</button>
		</>
	);
};

export default ImportButton;
