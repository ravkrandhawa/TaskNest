// const express = require("express");
// const cors = require("cors");
// const { createProxyMiddleware } = require("http-proxy-middleware");

// const app = express();
// const PORT = process.env.PORT || 8000;

// app.use(cors());
// app.use(express.json());

// // ✅ Proxy to Task-service root clearly
// app.use('/api/tasks', createProxyMiddleware({
//   target: 'http://localhost:5001',
//   changeOrigin: true
// }));

// // ✅ Proxy to File-service root clearly (for files listing & deletion)
// app.use('/api/files', createProxyMiddleware({
//   target: 'http://localhost:5002',
//   changeOrigin: true
// }));

// // ✅ Proxy to File-service root clearly (for file uploads)
// app.use('/api/upload', createProxyMiddleware({
//   target: 'http://localhost:5002',
//   changeOrigin: true
// }));

// app.listen(PORT, () => console.log(`API Gateway running clearly on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

// Don't use express.json() on proxied routes (otherwise it caused the earlier conflict)
app.use('/api/tasks', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  logLevel: 'debug'
}));

// File-service routes (unchanged)
app.use('/api/files', createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true
}));

app.use('/api/upload', createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true
}));

app.listen(PORT, () => console.log(`API Gateway running clearly on port ${PORT}`));





