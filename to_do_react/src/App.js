import React, { useEffect, useState } from "react";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getCompletedTodos,
  getPendingTodos,
} from "./api";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });

  // Load todos when filter changes
  useEffect(() => {
    loadTodos();
  }, [filter]);

  async function loadTodos() {
    let data;
    if (filter === "completed") data = await getCompletedTodos();
    else if (filter === "pending") data = await getPendingTodos();
    else data = await getTodos();
    setTodos(data);
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    if (!newTodo.title.trim()) return alert("Title is required");
    await addTodo({ ...newTodo, is_completed: false });
    setNewTodo({ title: "", description: "" });
    loadTodos();
  }

  async function handleToggleComplete(todo) {
    await updateTodo(todo.id, { ...todo, is_completed: !todo.is_completed });
    loadTodos();
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this todo?")) {
      await deleteTodo(id);
      loadTodos();
    }
  }

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <h1 style={styles.title}>📝 Todo List</h1>

        {/* Add new todo - Card */}
        <div style={styles.card}>
          <form onSubmit={handleAddTodo} style={styles.form}>
            <input
              type="text"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              style={styles.input}
            />
            <button type="submit" style={styles.addButton}>Add</button>
          </form>
        </div>

        {/* Filter buttons */}
        <div style={styles.filter}>
          <button
            style={filter === "all" ? styles.activeButton : styles.button}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            style={filter === "completed" ? styles.activeButton : styles.button}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            style={filter === "pending" ? styles.activeButton : styles.button}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
        </div>

        {/* Todo list */}
        <ul style={styles.list}>
          {todos.length === 0 ? (
            <div style={styles.card}>
              <p style={styles.emptyText}>No todos found.</p>
            </div>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} style={styles.todoCard}>
                <div>
                  <strong style={{
                    textDecoration: todo.is_completed ? "line-through" : "none",
                    color: todo.is_completed ? "#999" : "#333"
                  }}>
                    {todo.title}
                  </strong>
                  <p style={{ 
                    margin: "5px 0", 
                    color: todo.is_completed ? "#999" : "#666",
                    fontSize: "14px"
                  }}>
                    {todo.description}
                  </p>
                  <div style={{ fontSize: "14px", marginTop: "8px" }}>
                    Status:{" "}
                    {todo.is_completed ? (
                      <span style={{ color: "green", fontWeight: "500" }}>✅ Completed</span>
                    ) : (
                      <span style={{ color: "orange", fontWeight: "500" }}>⏳ Pending</span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleToggleComplete(todo)}
                    style={styles.smallButton}
                  >
                    {todo.is_completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
  },
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: "2.5rem",
    marginBottom: "30px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  form: { 
    display: "flex", 
    gap: "10px",
    flexWrap: "wrap",
  },
  input: {
    flex: "1",
    minWidth: "200px",
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    fontSize: "14px",
  },
  addButton: {
    padding: "12px 24px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  filter: { 
    marginBottom: "20px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "white",
    color: "#333",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
  },
  activeButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#667eea",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transform: "scale(1.05)",
  },
  list: { 
    listStyle: "none", 
    padding: 0,
    margin: 0,
  },
  todoCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    marginBottom: "12px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: "16px",
  },
  smallButton: {
    padding: "8px 16px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s",
  },
  deleteButton: {
    padding: "8px 16px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s",
  },
};


export default App;
