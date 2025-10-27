const API_BASE = "http://localhost:8000/api/v1/todos";

const buildListUrl = (filter, skip, limit) => {
    if (filter === "completed") return `${API_BASE}/filter/completed?skip=${skip}&limit=${limit}`;
    if (filter === "pending")   return `${API_BASE}/filter/pending?skip=${skip}&limit=${limit}`;
    return `${API_BASE}?skip=${skip}&limit=${limit}`;
};

export async function fetchTodos(filter = "all", skip = 0, limit = 10) {
    const url = buildListUrl(filter, skip, limit);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json(); // { items, total }
}

export async function createTodo(payload) {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to add todo");
    return res.json(); // new item
}

export async function updateTodo(id, payload) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    return res.json();
}

export async function deleteTodo(id) {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete todo");
    return true;
}
