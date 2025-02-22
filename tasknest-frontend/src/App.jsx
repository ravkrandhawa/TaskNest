import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import TaskManager from "./TaskManager";
import CreateTask from "./CreateTask";


function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/tasks" /> : <Login setUser={setUser} />} />
                <Route path="/tasks" element={user ? <TaskManager /> : <Navigate to="/" />} />
                <Route path="/create" element={user ? <CreateTask /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
