import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "./api/api";
import { useNavigate } from "react-router-dom";

function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTasks() {
            const data = await getTasks();
            setTasks(data);
        }
        fetchTasks();
    }, []);

    const handleDeleteTask = async (taskId) => {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    return (
        <div className="task-manager">
            <h2>Task List</h2>
            <button onClick={() => navigate("/create")}>Create New Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <strong>{task.title}</strong>
                        <p>{task.description}</p>
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskManager;
