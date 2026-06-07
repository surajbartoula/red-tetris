import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import { createSocketServer } from "./sockets/socketServer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);

createSocketServer(server);

if (process.env["NODE_ENV"] === "production") {
	app.use(express.static(path.join(__dirname, "../../dist")));

	app.get("*", (_req, res) => {
		res.sendFile(path.join(__dirname, "../../dist/index.html"));
	});
}

const PORT = process.env["PORT"] || 3000;

server.listen(PORT, () => {
	console.log(`===================================================`);
	console.log(`🚀 Red Tetris Server listening on http://0.0.0.0:${PORT}`);
	console.log(`===================================================`);
});
