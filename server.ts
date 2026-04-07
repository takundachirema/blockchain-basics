import express from "express";
import fs from "fs";
import path from "path";
import { createXrplRouter } from "./api/xrpl";
import { createEthereumRouter } from "./api/ethereum";

// Support both:
// - dev (ts-node-dev): __dirname is project root
// - prod (node dist/server.js): __dirname is dist/
const devPublicDir = path.join(__dirname, "public");
const prodPublicDir = path.join(__dirname, "..", "public");
const publicDir = fs.existsSync(devPublicDir) ? devPublicDir : prodPublicDir;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(publicDir));
app.use(express.json());

app.use("/api", createXrplRouter());
app.use("/api", createEthereumRouter());

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

// In Vercel, the app is invoked as a serverless function.
// Locally (or other Node hosts), start an HTTP listener.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
