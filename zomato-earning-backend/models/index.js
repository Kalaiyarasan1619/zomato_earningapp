import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 1,
    min: 0,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// 🔥 FORCE CONNECTION (serverless-safe)
await sequelize.authenticate();
console.log("✅ DB Connected");

export default sequelize;
