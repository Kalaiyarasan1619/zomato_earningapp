import { DataTypes } from "sequelize";
import sequelize from "./index.js";

export const DailyEarning = sequelize.define(
  "DailyEarning",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    entryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    entryMonth: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    entryYear: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    petrolCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    cashOnDelivery: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    cashDeposit: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    otherCash: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    dailyWithDrawAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    totalEarnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  },
  {
    tableName: "daily_earnings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);
