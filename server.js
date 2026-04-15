const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["https://broker-frontend-pi.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Client-Id",
      "X-Device-Id",
      "x-requested-with",
      "x-signalr-user-agent",
    ],
  }),
);

const TARGET_URL = "http://brokersystem.runasp.net";

app.use(
  "/",
  createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    ws: true,
    onProxyRes: function (proxyRes, req, res) {
      const origin = req.headers.origin;
      if (
        origin === "https://broker-frontend-pi.vercel.app" ||
        origin === "http://localhost:5173"
      ) {
        proxyRes.headers["Access-Control-Allow-Origin"] = origin;
      }

      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
      proxyRes.headers["Access-Control-Allow-Methods"] =
        "GET, POST, PUT, DELETE, OPTIONS, PATCH";

      const requestHeaders = req.headers["access-control-request-headers"];
      if (requestHeaders) {
        proxyRes.headers["Access-Control-Allow-Headers"] = requestHeaders;
      }
    },
    onError: (err, req, res) => {
      console.error("Proxy Error:", err);
      res.status(500).send("Proxy failed.");
    },
  }),
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
