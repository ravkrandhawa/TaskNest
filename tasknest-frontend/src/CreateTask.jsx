import { useState } from "react";
import { createTask, uploadFile } from "./api/api";
import { useNavigate } from "react-router-dom";

function CreateTask() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask({ title, description });
            navigate("/tasks"); // Redirect to task list
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");
        const uploadedFile = await uploadFile(file);
        alert(`File uploaded: ${uploadedFile.fileUrl}`);
        setFile(null);
    };

    return (
        <div className="create-task">
            <h2>Create a New Task</h2>
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
                <h3>Upload File</h3>
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
    );
}

export default CreateTask;
