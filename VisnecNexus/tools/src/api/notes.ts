const API_BASE = "https://vnx-main-backend.onrender.com/tools/vnx-note-api";

export async function fetchNotes() {
  const res = await fetch(`${API_BASE}/notes`);
  return res.json();
}

export async function createNote(note) {
  const res = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return res.json();
}

export async function updateNote(id, updates) {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteNote(id) {
  await fetch(`${API_BASE}/notes/${id}`, {
    method: "DELETE",
  });
}
