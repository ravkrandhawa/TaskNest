require("dotenv").config(); 
const express = require("express"); 
const cors = require("cors"); 
const pool = require("./config/db");
const containerClient = require("./config/storage");
const multer = require("multer"); 

const app = express(); 
const PORT = process.env.PORT || 8000; 

app.use(express.json()); 
app.use(cors()); 

// Default get for now 
app.get("/", (req, res) => {
    res.send("TaskNest API is running!");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const result = await pool.query(
            "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
            [title, description]
        );

        console.log("Task saved:", result.rows[0]);
        res.json(result.rows[0]);

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// File Upload API 
const upload = multer({storage: multer.memoryStorage() }); 
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const blobName = `${Date.now()}-${req.file.originalname}`; 
        const blockBlobClient = containerClient.getBlockBlobClient(blobName); 

        await blockBlobClient.uploadData(req.file.buffer); 
        res.json({ fileUrl: blockBlobClient.url });
    } catch (err) {
        console.log(err); 
        res.status(500).json({ error: "Upload failed "}); 
    }
}); 

// Delete Task API
app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

const { BlobServiceClient } = require("@azure/storage-blob");

// List all files in Azure Blob Storage
app.get("/files", async (req, res) => {
    try {
        const blobs = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            blobs.push({
                name: blob.name,
                url: `https://${process.env.DB_HOST}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blob.name}`
            });
        }
        res.json(blobs);
    } catch (err) {
        console.error("Error fetching files:", err);
        res.status(500).json({ error: "Failed to fetch files" });
    }
});

// Delete a file from Azure Blob Storage
app.delete("/files/:fileName", async (req, res) => {
    try {
        const { fileName } = req.params;
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.delete();
        res.json({ message: "File deleted successfully" });
    } catch (err) {
        console.error("Error deleting file:", err);
        res.status(500).json({ error: "Failed to delete file" });
    }
});




app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 