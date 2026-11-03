// This file builds the Express "app" - the object that handles all
// incoming HTTP requests. Routes get added here later.
// Keeping the app separate from server.js makes it easy to test.

import express from "express";
import cors from "cors";

const app = express();

// Allow requests only from our frontend (CLIENT_URL in .env),
// e.g. the Vite dev server on http://localhost:5173
app.use(cors({ origin: process.env.CLIENT_URL }));

// Lets the app read JSON bodies sent in requests (e.g. POST login form)
app.use(express.json());

// Simple health check so we (and deployment tools) can confirm the API is up.
// Test it with: GET http://localhost:5000/api/health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

export default app;
