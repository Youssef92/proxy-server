const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// لكل حاجة (API + SignalR)
app.use(
  "/",
  createProxyMiddleware({
    target: "http://brokersystem.runasp.net",
    changeOrigin: true,
    ws: true,
    secure: false,
    logLevel: "debug",
  }),
);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});

// مهم جدا للـ WebSocket
server.on("upgrade", (req, socket, head) => {
  console.log("WebSocket upgrade");
});
