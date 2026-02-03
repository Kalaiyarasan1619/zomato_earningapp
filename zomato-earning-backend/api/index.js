import express from "express";
import cors from "cors";
import "../models/index.js"; // just importing initializes sequelize
import { router as earningsRouter } from "../routes/earnings.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 test route
app.get("/api", (req, res) => {
  res.send("Earnings API is Live 🚀");
});

// 🔥 actual routes
app.use("/api/earnings", earningsRouter);

// ❌ NO app.listen
export default app;
