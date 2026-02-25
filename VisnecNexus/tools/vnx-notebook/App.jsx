
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [language, setLanguage] = useState('text');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('vnx-notes')) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem('vnx-notes', JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    if (!title.trim() || !content.trim()) return;
    const newNote = { title, content, tag, language };

    if (editIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = newNote;
      setNotes(updatedNotes);
      setEditIndex(null);
    } else {
      setNotes([newNote, ...notes]); // latest first
    }

    setTitle('');
    setContent('');
    setTag('');
    setLanguage('text');
  };

  const deleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  const editNote = (index) => {
    const note = notes[index];
    setTitle(note.title);
    setContent(note.content);
    setTag(note.tag);
    setLanguage(note.language);
    setEditIndex(index);
  };

  const copyContent = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">🧠 Notebook VNX</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded mb-2 h-24"
        />
        <input
          type="text"
          placeholder="Tag (optional)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="text">Plain Text</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
        </select>
        <button
          onClick={saveNote}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {editIndex !== null ? 'Update Note' : 'Save Note'}
        </button>
      </div>

      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">🗒️ Your Notes</h2>
        <ul className="space-y-4">
          {notes.map((note, index) => (
            <li key={index} className="bg-white p-4 rounded shadow relative">
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <p className="text-gray-700 mt-1">{note.content}</p>
              {note.tag && (
                <span className="text-sm mt-2 inline-block text-blue-600">
                  #{note.tag}
                </span>
              )}
              {note.language && (
                <span className="text-sm mt-1 block text-purple-600 italic">
                  Language: {note.language}
                </span>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => copyContent(note.content)} className="text-blue-500 hover:text-blue-700">📋</button>
                <button onClick={() => editNote(index)} className="text-yellow-500 hover:text-yellow-700">✏️</button>
                <button onClick={() => deleteNote(index)} className="text-red-500 hover:text-red-700">❌</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
