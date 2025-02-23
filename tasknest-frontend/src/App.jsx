import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Tasks from "./Tasks";
import Files from "./Files"; // ✅ Import Files Component
import "./App.css";
import { useState } from "react";
import { createTask, uploadFile } from "./api/api";

function App() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        await createTask({ title, description, user_id: 1 });
        setTitle("");
        setDescription("");
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");
        const uploadedFile = await uploadFile(file);
        alert(`File uploaded: ${uploadedFile.fileUrl}`); // ✅ Fixed Template String Syntax
        setFile(null);
    };

    return (
        <Router>
            <div className="container">
                <nav className="navbar">
                    <Link to="/">🏠 Home</Link>
                    <Link to="/tasks">📋 Task List</Link>
                    <Link to="/files">📂 Files</Link> {/* ✅ Added Files Link */}
                </nav>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <div>
                                <h1>TaskNest</h1>
                                <form onSubmit={handleCreateTask}>
                                    <input
                                        type="text"
                                        placeholder="Task Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        placeholder="Task Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Create Task</button>
                                </form>

                                <div className="upload-section">
                                    <h2>Upload File</h2>
                                    <form onSubmit={handleFileUpload}>
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            required
                                        />
                                        <button type="submit">Upload</button>
                                    </form>
                                </div>
                            </div>
                        }
                    />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/files" element={<Files />} /> {/* ✅ Added Route for Files Page */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
