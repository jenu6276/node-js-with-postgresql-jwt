module.exports = {
  HOST: "YOUR_HOSTNAME",
  USER: "YOUR_USERNAME",
  PASSWORD: "YOUR_PASSWORD",
  DB: "YOUR_DB_NAME",
  dialect: "postgres",
  pool: {
    max: 3,
    min: 0,
    acquire: 20000,
    idle: 15000
  }
};
