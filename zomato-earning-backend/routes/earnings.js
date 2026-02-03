import express from "express";
import { DailyEarning } from "../models/dailyEarning.js";
import { Op } from "sequelize";

const router = express.Router();

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// INSERT DAILY EARNING
router.post("/", async (req, res) => {
  try {
    const {
      isoDate,
      petrolCost = 0,
      cashOnDelivery = 0,
      cashDeposit = 0,
      otherCash = 0,
      otherType = null,
      totalEarnings = 0,
      dailyWithDrawAmount = 0
    } = req.body;

    if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
      return res.status(400).json({ error: "Valid isoDate required" });
    }

    const [year, month] = isoDate.split("-").map(Number);

    const row = await DailyEarning.create({
      entryDate: isoDate,
      entryMonth: MONTH_NAMES[month - 1],
      entryYear: year,
      petrolCost,
      cashOnDelivery,
      cashDeposit,
      otherCash,
      otherType,
      totalEarnings,
      dailyWithDrawAmount
    });

    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// OTHER TYPES
router.get("/other-types", async (req, res) => {
  try {
    const rows = await DailyEarning.findAll({
      attributes: [
        [DailyEarning.sequelize.fn("DISTINCT",
          DailyEarning.sequelize.col("otherType")), "otherType"]
      ],
      where: { otherType: { [Op.ne]: null } }
    });

    res.json(rows.map(r => r.otherType).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
