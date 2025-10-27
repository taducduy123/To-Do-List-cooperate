import { useState } from "react";
import styles from "./TodoForm.module.css";

export default function TodoForm({ onCreate }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return alert("Title is required");
        await onCreate({ title, description });
        setTitle("");
        setDescription("");
    };

    return (
        <form onSubmit={submit} className={styles.form}>
            <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
            />
            <input
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.input}
            />
            <button type="submit" className={`${styles.btn} ${styles.addBtn}`}>
                ➕ Add
            </button>
        </form>
    );
}
