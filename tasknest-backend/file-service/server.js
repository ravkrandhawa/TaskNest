const express = require("express");
const cors = require("cors");
const multer = require("multer");
const containerClient = require("./config/storage");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// Upload file to Azure Blob Storage (at "/")
app.post("/", upload.single("file"), async (req, res) => {
  try {
    const blobName = `${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(req.file.buffer);
    res.json({ fileUrl: blockBlobClient.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File upload failed" });
  }
});

// List files from Azure Blob Storage (at "/")
app.get("/", async (req, res) => {
  try {
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push({
        name: blob.name,
        url: `https://${containerClient.accountName}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blob.name}`
      });
    }
    res.json(blobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list files" });
  }
});

// Delete file from Azure Blob Storage (at "/:fileName")
app.delete("/:fileName", async (req, res) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(req.params.fileName);
    await blockBlobClient.delete();
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

app.listen(PORT, () => console.log(`File Service running clearly on port ${PORT}`));
