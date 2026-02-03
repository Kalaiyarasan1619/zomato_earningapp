import express from "express";
import cors from "cors";
import sequelize from "../models/index.js";

import earningsRouter from "../routes/earnings.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 root test
app.get("/", (req, res) => {
  res.send("Zomato Earning Backend LIVE 🚀");
});

// routes
app.use("/api/earnings", earningsRouter);

// ❌ NO app.listen
export default app;
