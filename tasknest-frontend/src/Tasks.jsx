import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "./api/api";
import "./App.css";

function Tasks() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function fetchTasks() {
            const data = await getTasks();
            setTasks(data);
        }
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await deleteTask(id);
            setTasks(tasks.filter((task) => task.id !== id)); // Remove task from UI
        }
    };

    return (
        <div className="container">
            <h1>Task List</h1>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id} className="task-card">
                        <strong>{task.title}</strong> - {task.description}
                        <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tasks;
