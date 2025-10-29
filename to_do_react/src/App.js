import {useEffect, useState} from "react";
import  "./App.css";

import TodoForm from "./components/TodoForm/TodoForm";
import FilterBar from "./components/FilterBar/FilterBar";
import TodoTable from "./components/TodoTable/TodoTable";


import {fetchTodos, createTodo, updateTodo, deleteTodo} from "./api";

export default function App() {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // yêu cầu: tối đa 10/ trang
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false); // thêm loading để hiển thị spinner

    useEffect(() => {
        load().catch(console.error);
    }, [filter, page, limit]);

    const load = async (opts = {}) => {
        setLoading(true);
        try {
            const curPage = opts.page ?? page;
            const curFilter = opts.filter ?? filter;
            const skip = (curPage - 1) * limit;

            const data = await fetchTodos(curFilter, skip, limit);
            setTodos(data.items);
            setTotal(Number(data.total));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (payload) => {
        const newItem = await createTodo(payload);
        setTodos((prev) => (prev.length < limit ? [newItem, ...prev] : [newItem, ...prev.slice(0, limit - 1)]));
        setPage(1);
        setTotal((prev) => prev + 1);
        setFilter("all");
    };

    const handleToggle = async (todo) => {
        await updateTodo(todo.id, {...todo, is_completed: !todo.is_completed});
        await load();
    };

    const handleDelete = async (id) => {
        // if (!window.confirm("Delete this todo?")) return;
        await deleteTodo(id);

        // Xóa phần tử trong todos
        setTodos((prev) => prev.filter((t) => t.id !== id));

        // Tính lại trang hiện tại phòng trường hợp xóa phần tử cuối của trang cuối
        const nextTotal = Math.max(0, total - 1);
        const nextMaxPage = Math.max(1, Math.ceil(nextTotal / limit));
        const nextPage = page > nextMaxPage ? nextMaxPage : page;

        setPage(nextPage);
        setTotal(nextTotal);
    };

    return (

        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center col-12 col-md-8 col-lg-8">
            <div className="card shadow border-0 bg-primary-subtle">
                <div className="card-body">
                    <h1 className="h3 mb-4 text-center">📝 Todo List</h1>

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
                        total={total}
                        loading={loading}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </div>

    );
}
