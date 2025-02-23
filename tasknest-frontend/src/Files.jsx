import { useEffect, useState } from "react";
import { getFiles, deleteFile } from "./api/api";
import "./App.css";

function Files() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        async function fetchFiles() {
            const data = await getFiles();
            setFiles(data);
        }
        fetchFiles();
    }, []);

    const handleDelete = async (fileName) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            await deleteFile(fileName);
            setFiles(files.filter((file) => file.name !== fileName)); // Remove from UI
        }
    };

    return (
        <div className="container">
            <h1>Uploaded Files</h1>
            <ul>
                {files.map((file) => (
                    <li key={file.name} className="task-card">
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.name}
                        </a>
                        <button className="delete-btn" onClick={() => handleDelete(file.name)}>
                            ❌ Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Files;
