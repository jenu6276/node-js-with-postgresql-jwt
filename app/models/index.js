const config = require("../config/db.config.js"); // Replace with the actual path

const Sequelize = require("sequelize");

const { DB, USER, PASSWORD, HOST, dialect, pool } = config;
const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect,
  pool: {
    max: pool.max,
    min: pool.min,
    acquire: pool.acquire,
    idle: pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/user.model.js')(sequelize, Sequelize);
db.role = require('../models/role.model.js')(sequelize, Sequelize);

const { user, role } = db;

role.belongsToMany(user, { through: 'user_roles' });
user.belongsToMany(role, { through: 'user_roles' });

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;
