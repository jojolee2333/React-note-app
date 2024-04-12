interface Note {
  title: string;
  body: string;
  id: number;
  updated: string;
};

export default class NotesAPI {
  static getAllNotes(): Note[] {
    const notesJson = localStorage.getItem("notesapp-notes");
    let notes: Note[] = [];
  
    if (notesJson) {
      try {
        notes = JSON.parse(notesJson);
      } catch (error) {
        console.error("Error parsing notes JSON:", error);
      }
    }
  
    // 对笔记按更新时间降序排序
    notes.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
  
    return notes;
  }
  

  static saveNote(noteToSave: Note) {
    const notes = NotesAPI.getAllNotes();
    const existing = notes.find((note) => note.id === noteToSave.id);
    
    // Edit/Update
    if (existing) {
      existing.title = noteToSave.title;
      existing.body = noteToSave.body;
      existing.updated = new Date().toISOString();
    } else {
      noteToSave.id = Math.floor(Math.random() * 1000000);
      noteToSave.updated = new Date().toISOString();
      notes.push(noteToSave);
    }

    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
  }

  static deleteNote(id: number) {
    const notes = NotesAPI.getAllNotes();
    const newNotes = notes.filter((note) => note.id != id);

    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
  }
}
