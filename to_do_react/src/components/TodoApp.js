// import React, { useState, useEffect } from "react";
//
// const API_BASE = "http://localhost:8000/api/v1/todos";
//
// function TodoApp() {
//   const [todos, setTodos] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [filter, setFilter] = useState("all");
//
//   // Fetch todos when filter changes
//   useEffect(() => {
//     let url = API_BASE;
//     if (filter === "completed") url += "/filter/completed";
//     else if (filter === "pending") url += "/filter/pending";
//
//     fetch(url)
//       .then(res => res.json())
//       .then(data => setTodos(data))
//       .catch(err => console.error("❌ Error fetching todos:", err));
//   }, [filter]);
//
//   // Add a new todo
//   const addTodo = async (e) => {
//     e.preventDefault();
//     const newTodo = { title, description, is_completed: false };
//
//     const res = await fetch(API_BASE, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newTodo),
//     });
//
//     const data = await res.json();
//     setTodos([...todos, data]);
//     setTitle("");
//     setDescription("");
//   };
//
//   // Toggle complete
//   const toggleTodo = async (id, is_completed) => {
//     const res = await fetch(`${API_BASE}/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ is_completed: !is_completed }),
//     });
//     const updated = await res.json();
//     setTodos(todos.map(t => (t.id === id ? updated : t)));
//   };
//
//   // Delete
//   const deleteTodo = async (id) => {
//     await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
//     setTodos(todos.filter(t => t.id !== id));
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h1 className="text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
//             <span className="text-6xl">📝</span>
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Todo List
//             </span>
//           </h1>
//           <p className="text-gray-600 mt-2">Organize your tasks efficiently</p>
//         </div>
//
//         {/* Add Todo Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
//           <form onSubmit={addTodo} className="flex flex-col sm:flex-row gap-3">
//             <input
//               type="text"
//               placeholder="Title"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//               required
//               className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-gray-700 placeholder-gray-400"
//             />
//             <input
//               type="text"
//               placeholder="Description"
//               value={description}
//               onChange={e => setDescription(e.target.value)}
//               required
//               className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-gray-700 placeholder-gray-400"
//             />
//             <button
//               type="submit"
//               className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
//             >
//               Add
//             </button>
//           </form>
//         </div>
//
//         {/* Filter Buttons */}
//         <div className="flex flex-wrap justify-center gap-3 mb-8">
//           <button
//             onClick={() => setFilter("all")}
//             className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
//               filter === "all"
//                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
//                 : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
//             }`}
//           >
//             All
//           </button>
//           <button
//             onClick={() => setFilter("completed")}
//             className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
//               filter === "completed"
//                 ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
//                 : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
//             }`}
//           >
//             Completed
//           </button>
//           <button
//             onClick={() => setFilter("pending")}
//             className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
//               filter === "pending"
//                 ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105"
//                 : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
//             }`}
//           >
//             Pending
//           </button>
//         </div>
//
//         {/* Todo List */}
//         {todos.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
//             <div className="text-6xl mb-4">🎯</div>
//             <p className="text-gray-500 text-lg">No todos found.</p>
//             <p className="text-gray-400 text-sm mt-2">Add a task to get started!</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {todos.map(todo => (
//               <div
//                 key={todo.id}
//                 className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 transition-all duration-200 transform hover:-translate-y-1"
//               >
//                 <div className="flex items-start gap-4">
//                   {/* Checkbox Circle */}
//                   <div
//                     onClick={() => toggleTodo(todo.id, todo.is_completed)}
//                     className={`flex-shrink-0 w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
//                       todo.is_completed
//                         ? "bg-green-500 border-green-500"
//                         : "border-gray-300 hover:border-green-400"
//                     }`}
//                   >
//                     {todo.is_completed && (
//                       <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
//                         <path d="M5 13l4 4L19 7"></path>
//                       </svg>
//                     )}
//                   </div>
//
//                   {/* Content */}
//                   <div className="flex-1 min-w-0">
//                     <h3
//                       className={`text-lg font-semibold mb-1 ${
//                         todo.is_completed
//                           ? "line-through text-gray-400"
//                           : "text-gray-800"
//                       }`}
//                     >
//                       {todo.title}
//                     </h3>
//                     <p className={`text-sm ${
//                       todo.is_completed ? "text-gray-400" : "text-gray-600"
//                     }`}>
//                       {todo.description}
//                     </p>
//                   </div>
//
//                   {/* Action Buttons */}
//                   <div className="flex gap-2 flex-shrink-0">
//                     <button
//                       onClick={() => toggleTodo(todo.id, todo.is_completed)}
//                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                         todo.is_completed
//                           ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
//                           : "bg-green-100 text-green-700 hover:bg-green-200"
//                       }`}
//                     >
//                       {todo.is_completed ? "Undo" : "Done"}
//                     </button>
//                     <button
//                       onClick={() => deleteTodo(todo.id)}
//                       className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// export default TodoApp;
