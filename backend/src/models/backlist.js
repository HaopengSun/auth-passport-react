const { DataTypes } = require("sequelize");
const sequelize = require("../database/index");

const Blacklist = sequelize.define("Blacklist", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Blacklist;