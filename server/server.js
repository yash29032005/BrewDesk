require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const allRoutes = require("./route");
const sql = require("./config/db");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.VITE_WEB_URL}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// ✅ Test Neon connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    res.json({ postgres: result[0].version });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/api", allRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
