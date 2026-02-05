import env from "../config/env.js";
import { Sequelize } from "sequelize";

if (!env.DB_URL) {
  throw new Error("❌ DB_URL missing in .env");
}

const sequelize = new Sequelize(env.DB_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;
