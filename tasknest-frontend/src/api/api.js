import axios from "axios"; // axios is better at handling requests than fetch 

const API_URL = "http://localhost:8000"; // Update if needed

export const getTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    return response.json();
};

export const createTask = async (task) => {
    console.log("Sending task to API:", task);
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Task created:", data);
        return data;
    } catch (error) {
        console.error("Error creating task:", error);
    }
};


export const deleteTask = async (taskId) => {
    await fetch(`${API_URL}/tasks/${taskId}`, { method: "DELETE" });
};


export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", file.name); // Debugging log

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    console.log("File uploaded:", data); // Check what the API returns
    return data;
};

