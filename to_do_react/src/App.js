import React, {useState, useEffect, useRef} from "react";
import "./App.css";

const API_BASE = "http://localhost:8000/api/v1/todos";

function App() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);



    useEffect(() => {
        const fetchTodos = async () => {

            const skip = (page - 1) * limit;
            let url = `${API_BASE}?skip=${skip}&limit=${limit}`;

            if (filter === "completed")
                url = `${API_BASE}/filter/completed?skip=${skip}&limit=${limit}`;
            else if (filter === "pending")
                url = `${API_BASE}/filter/pending?skip=${skip}&limit=${limit}`;

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);


                const data = await res.json();
                setTodos(data.items.slice(0, limit));
                setTotal(data.total - 1);


            } catch (err) {
                console.error("❌ Error fetching todos:", err);
            }
        };

        fetchTodos();
    }, [filter, page, limit]);

    // --- Add new todo ---
    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!title.trim()) return alert("Title is required");

        try {
            const res = await fetch(API_BASE, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, description, is_completed: false}),
            });
            if (!res.ok) throw new Error("Failed to add todo");

            // Set new item to top of list
            const data = await res.json()
            setTodos([data, ...todos]);

            // Reset form
            setTitle("");
            setDescription("");
            setPage(1);

        } catch (err) {
            console.error("❌ Error adding todo:", err);
        }
    };

    const handleToggleComplete = async (todo) => {
        try {
            const res = await fetch(`${API_BASE}/${todo.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...todo, is_completed: !todo.is_completed}),
            });
            if (!res.ok) throw new Error("Failed to toggle todo");

            const skip = (page - 1) * limit;
            let url = `${API_BASE}?skip=${skip}&limit=${limit}`;
            if (filter === "completed")
                url = `${API_BASE}/filter/completed?skip=${skip}&limit=${limit}`;
            else if (filter === "pending")
                url = `${API_BASE}/filter/pending?skip=${skip}&limit=${limit}`;

            const refreshed = await fetch(url);
            const data = await refreshed.json();
            setTodos(data.items);
            setTotal(data.total);
        } catch (err) {
            console.error("❌ Error toggling todo:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this todo?")) return;

        try {
            const res = await fetch(`${API_BASE}/${id}`, {method: "DELETE"});
            if (!res.ok) throw new Error("Failed to delete todo");

            const skip = (page - 1) * limit;
            let url = `${API_BASE}?skip=${skip}&limit=${limit}`;
            if (filter === "completed")
                url = `${API_BASE}/filter/completed?skip=${skip}&limit=${limit}`;
            else if (filter === "pending")
                url = `${API_BASE}/filter/pending?skip=${skip}&limit=${limit}`;

            const refreshed = await fetch(url);
            const data = await refreshed.json();
            setTodos(data.items);
            setTotal(data.total);

        } catch (err) {
            console.error("❌ Error deleting todo:", err);
        }
    };

    const maxPage = Math.ceil(total / limit) || 1;

    return (
        <div className="todo-container">
            <h1 className="todo-header">📝 Todo List</h1>

            {/* Add Todo Form */}
            <form onSubmit={handleAddTodo} className="todo-form">
                <input
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="todo-input"
                />
                <input
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="todo-input"
                />
                <button type="submit" className="btn add-btn">➕ Add</button>
            </form>

            {/* Filter Buttons */}
            <div className="filter-container">
                {["all", "completed", "pending"].map((f) => (
                    <button
                        key={f}
                        onClick={() => {
                            setFilter(f);
                            setPage(1);
                        }}
                        className={`btn filter-btn ${filter === f ? "active" : ""}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Todo Table */}
            <div className="todo-table-container">
                <table className="todo-table">
                    <thead className="table-header">
                    <tr>
                        <th className="th">#</th>
                        <th className="th">Title</th>
                        <th className="th">Description</th>
                        <th className="th">Status</th>
                        <th className="th">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {todos.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="empty-cell">No todos found.</td>
                        </tr>
                    ) : (
                        todos.map((todo, index) => (
                            <tr key={todo.id} className="tr">
                                <td className="td">{(page - 1) * limit + index + 1}</td>
                                <td className={`td ${todo.is_completed ? "completed" : ""}`}>
                                    {todo.title}
                                </td>
                                <td className="td">{todo.description}</td>
                                <td className="td">
                                    {todo.is_completed ? (
                                        <span className="status status-done">✅ Completed</span>
                                    ) : (
                                        <span className="status status-pending">⏳ Pending</span>
                                    )}
                                </td>
                                <td className="td">
                                    <button
                                        onClick={() => handleToggleComplete(todo)}
                                        className={`btn sm-btn ${todo.is_completed ? "btn-undo" : "btn-done"}`}
                                    >
                                        {todo.is_completed ? "Undo" : "Done"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(todo.id)}
                                        className="btn sm-btn btn-delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="btn page-btn"
                >
                    ⬅ Prev
                </button>
                <span className="page-info">Page {page} / {maxPage}</span>
                <button
                    onClick={() => setPage((prev) => (prev < maxPage ? prev + 1 : prev))}
                    disabled={page >= maxPage}
                    className="btn page-btn"
                >
                    Next ➡
                </button>
            </div>
        </div>
    );
}


export default App;

// --------------------------
// Styles
// --------------------------
const styles = {
    container: {
        width: "100vw",            // full screen width
        height: "100vh",           // full screen height
        margin: 0,
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #5f00b3, #007bff)", // 💜→💙
        color: "white", // make text visible on dark background
    },
    header: {
        textAlign: "center",
        color: "#007bff",
        fontSize: "32px",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    addButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        padding: "10px 16px",
        cursor: "pointer",
    },
    filterContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "15px",
    },
    filterButton: {
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    todoTableContainer: {
        maxHeight: "400px",
        overflowY: "auto",
        marginTop: "20px",
        marginBottom: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    todoTable: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "600px",
    },
    tableHeader: {
        position: "sticky",
        top: 0,
        backgroundColor: "#007bff",
        color: "white",
        zIndex: 1,
    },
    th: {
        padding: "12px",
        textAlign: "left",
        fontWeight: "bold",
        borderBottom: "2px solid #ddd",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #eee",
        verticalAlign: "top",
    },
    tr: {
        transition: "background 0.2s ease",
    },
    emptyCell: {
        textAlign: "center",
        padding: "40px",
        color: "#888",
    },
    smallButton: {
        border: "none",
        borderRadius: "6px",
        color: "white",
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: "13px",
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        marginTop: "10px",
    },
    pageButton: {
        padding: "8px 14px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        cursor: "pointer",
    },
    pageInfo: {
        fontWeight: "bold",
    },
};
