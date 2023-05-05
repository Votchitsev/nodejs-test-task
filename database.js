const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URI);

async function syncDatabase() {
  await sequelize.sync({ alter: true });
}

syncDatabase();

module.exports = sequelize;
