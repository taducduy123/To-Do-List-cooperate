// src/api.js

const API_BASE = "http://localhost:8000/api/v1/todos"; // adjust if backend runs elsewhere

// 🟢 Get all todos
export async function getTodos() {
  const res = await fetch(API_BASE);
  const data = await res.json();

  // Your backend returns { total, items: [...] }
  return data.items || [];
}

// 🟢 Create a new todo
export async function addTodo(todo) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return res.json();
}

// 🟢 Update an existing todo
export async function updateTodo(id, todo) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return res.json();
}

// 🟢 Delete a todo
export async function deleteTodo(id) {
  await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
}

// 🟢 Get completed todos
export async function getCompletedTodos() {
  const res = await fetch(`${API_BASE}/filter/completed`);
  return res.json();
}

// 🟢 Get pending todos
export async function getPendingTodos() {
  const res = await fetch(`${API_BASE}/filter/pending`);
  return res.json();
}
