import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("amazon_agent.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    asin TEXT,
    link TEXT,
    price REAL,
    cost REAL,
    profit REAL,
    market TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT,
    body TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { id, name, asin, link, price, cost, profit, market } = req.body;
    const insert = db.prepare("INSERT OR REPLACE INTO products (id, name, asin, link, price, cost, profit, market) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    insert.run(id, name, asin, link, price, cost, profit, market);
    res.json({ success: true });
  });

  app.get("/api/listings", (req, res) => {
    const listings = db.prepare("SELECT * FROM listings ORDER BY created_at DESC").all();
    res.json(listings);
  });

  app.post("/api/listings", (req, res) => {
    const { title, content } = req.body;
    const insert = db.prepare("INSERT INTO listings (title, content) VALUES (?, ?)");
    insert.run(title, JSON.stringify(content));
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
