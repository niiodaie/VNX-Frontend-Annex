import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { t, i18n } = useTranslation();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [language, setLanguage] = useState('text');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('https://vnx-main-backend.onrender.com/tools/vnx-note-api/notes');
      const data = await res.json();
      setNotes(data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!title || !content) return;

    const method = editingNoteId ? 'PUT' : 'POST';
    const url = editingNoteId
      ? `https://vnx-main-backend.onrender.com/tools/vnx-note-api/notes/${editingNoteId}`
      : 'https://vnx-main-backend.onrender.com/tools/vnx-note-api/notes';

    const noteData = { title, content, tag, language };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      if (res.ok) {
        toast.success(t("noteSaved"));
        setTitle('');
        setContent('');
        setTag('');
        setLanguage('text');
        setEditingNoteId(null);
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setTag(note.tag);
    setLanguage(note.language);
    setEditingNoteId(note._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://vnx-main-backend.onrender.com/tools/vnx-note-api/notes/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success(t("noteDeleted"));
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uniqueTags = [...new Set(notes.map((note) => note.tag).filter(Boolean))];

  const filteredNotes = selectedTag
    ? notes.filter((note) => note.tag === selectedTag)
  return (
  <div className="max-w-2xl mx-auto px-4 py-8">
    {/* Language Dropdown */}
    <div className="flex justify-end mb-4">
      <select
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        defaultValue={i18n.language}
        className="p-1 border rounded"
      >
        <option value="en">GB English</option>
        <option value="fr">FR French</option>
        <option value="es">ES Spanish</option>
        <option value="de">DE German</option>
        <option value="zh">CN Chinese</option>
        <option value="sw">SW Swahili</option> {/* ✅ Newly Added */}
      </select>
    </div>

    <h1 className="text-3xl font-bold text-center mb-6">🧠 {t("title")}</h1>

      <h1 className="text-3xl font-bold text-center mb-6">🧠 {t("title")}</h1>

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder={t("title")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder={t("content")}
        rows="4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder={t("tagOptional")}
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />

      <select
        className="w-full p-2 border rounded mb-4"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="text">{t("plainText")}</option>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>

      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        {t("saveNote")}
      </button>

      <h2 className="text-xl font-semibold mt-8 mb-2">📌 {t("filterByTag")}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => setSelectedTag(null)}
        >
          {t("all")}
        </button>
        {uniqueTags.map((tag, i) => (
          <button
            key={i}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setSelectedTag(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">📚 {t("yourNotes")}</h2>

      <ul>
        {filteredNotes.map((note) => (
          <li key={note._id} className="relative border rounded p-4 mb-4 bg-white shadow">
            <strong>{note.title}</strong>
            <p className="mt-1 whitespace-pre-line">{note.content}</p>

            {note.tag && (
              <span className="text-sm mt-2 inline-block text-blue-600">#{note.tag}</span>
            )}

            {note.language && (
              <span className="text-sm mt-1 block text-purple-600 italic">
                {t("language")}: {note.language}
              </span>
            )}

            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={() => handleEdit(note)} className="text-orange-500">✏️</button>
              <button onClick={() => handleDelete(note._id)} className="text-red-600">🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default App;
