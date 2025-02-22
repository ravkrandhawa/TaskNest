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
    res.send("TaskNest API is running! 🚀");
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 