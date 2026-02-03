import express from "express";
import cors from "cors";
import sequelize from "../models/index.js";
import earningsRouter from "../routes/earnings.js";

const app = express();

app.use(cors());
app.use(express.json());

// DB connect once (serverless safe)
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    await sequelize.authenticate();
    dbConnected = true;
    console.log("✅ DB Connected");
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Zomato Earning Backend LIVE 🚀");
});

app.use("/api/earnings", earningsRouter);

export default app;
