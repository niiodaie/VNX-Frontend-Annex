import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from './api/notes';

type Note = {
  id: string;
  content: string;
  date: string;
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes().then(setNotes);
  }, []);

  const handleCreate = async () => {
    if (!newNote.trim()) return;
    const created = await createNote({ content: newNote });
    setNotes(prev => [created, ...prev]);
    setNewNote('');
  };

  const handleUpdate = async (id: string, content: string) => {
    const updated = await updateNote(id, { content });
    setNotes(prev =>
      prev.map(note => (note.id === id ? updated : note))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">VNX Notebook</h1>

      <div className="mb-4">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          placeholder="Write a new note..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
          onClick={handleCreate}
        >
          Add Note
        </button>
      </div>

      {notes.map(note => (
        <div
          key={note.id}
          className="border rounded p-3 mb-3 bg-white shadow"
        >
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            value={note.content}
            onChange={e =>
              handleUpdate(note.id, e.target.value)
            }
          />
          <div className="text-xs text-gray-500">
            {new Date(note.date).toLocaleString()}
          </div>
          <button
            className="text-red-500 text-sm mt-1"
            onClick={() => handleDelete(note.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
