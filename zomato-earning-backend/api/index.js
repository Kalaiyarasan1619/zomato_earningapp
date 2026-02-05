import express from "express";
import cors from "cors";
import sequelize from "../models/index.js";
import earningsRouter from "../routes/earnings.js";

const app = express();

app.use(cors());
app.use(express.json());

let dbConnected = false;

app.use(async (req, res, next) => {
  try {
    if (!dbConnected) {
      await sequelize.authenticate();
      dbConnected = true;
      console.log("✅ DB Connected");
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Zomato Earning Backend LIVE 🚀");
});

app.use("/api/earnings", earningsRouter);

export default app;
