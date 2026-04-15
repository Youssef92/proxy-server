const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Proxy configuration for API and SignalR
const proxy = createProxyMiddleware({
  target: "http://brokersystem.runasp.net",
  changeOrigin: true,
  ws: true, // Enables proxying of WebSockets for SignalR support
  secure: false,
  logLevel: "debug",
});

// Use proxy for all incoming requests
app.use("/", proxy);

// Use port 10000 for Render or fallback to 3000 locally
const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

// Handle WebSocket upgrade events for SignalR debugging
server.on("upgrade", (req, socket, head) => {
  console.log("Proxying WebSocket upgrade for:", req.url);
});
