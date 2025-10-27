import { useEffect, useState } from "react";
import styles from "./App.module.css";

import TodoForm from "./components/TodoForm/TodoForm";
import FilterBar from "./components/FilterBar/FilterBar";
import TodoTable from "./components/TodoTable/TodoTable";
import Pagination from "./components/Pagination/Pagination";

import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./api";

export default function App() {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [maxPage, setMaxPage] = useState(1);


    useEffect(() => {
        load().catch(console.error);
    }, [filter, page, limit]);


    const load = async (opts = {}) => {
        const curPage = opts.page ?? page;
        const curFilter = opts.filter ?? filter;
        const skip = (curPage - 1) * limit;

        const data = await fetchTodos(curFilter, skip, limit);
        setTodos(data.items);
        setTotal(data.total);
        setMaxPage(Math.max(1, Math.ceil(data.total / limit)));
    };


    const handleCreate = async (payload) => {
        const newItem = await createTodo(payload);
        setTodos((prev) => (prev.length < limit ? [newItem, ...prev] : [newItem, ...prev.slice(0, limit - 1)]));
        setPage(1);
        setTotal((prev) => prev + 1);
        setMaxPage((prev) => Math.max(1, Math.ceil((total + 1) / limit)));
    };


    const handleToggle = async (todo) => {
        await updateTodo(todo.id, { ...todo, is_completed: !todo.is_completed });
        await load();
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Delete this todo?")) return;
        await deleteTodo(id);

        const nextTotal = Math.max(0, total - 1);
        const nextMaxPage = Math.max(1, Math.ceil(nextTotal / limit));
        const nextPage = page > nextMaxPage ? nextMaxPage : page;

        setTotal(nextTotal);
        setMaxPage(nextMaxPage);
        setPage(nextPage);

        await load({ page: nextPage });
    };


    return (
        <div className={styles.todoContainer}>
            <h1 className={styles.todoHeader}>📝 Todo List</h1>

            <TodoForm onCreate={handleCreate} />

            <FilterBar
                value={filter}
                onChange={(f) => {
                    setFilter(f);
                    setPage(1);
                }}
            />

            <TodoTable
                todos={todos}
                page={page}
                limit={limit}
                onToggle={handleToggle}
                onDelete={handleDelete}
            />

            <Pagination
                page={page}
                maxPage={maxPage}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => (p < maxPage ? p + 1 : p))}
            />
        </div>
    );
}
