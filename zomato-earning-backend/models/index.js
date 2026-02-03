import { Sequelize } from "sequelize";

let sequelize;

if (!global.sequelize) {
  global.sequelize = new Sequelize(process.env.DB_URL, {
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
}

sequelize = global.sequelize;

export default sequelize;   // 🔥 IMPORTANT
