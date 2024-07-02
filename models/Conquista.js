const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Jogo = require("../models/Jogo");

const Conquista = db.define(
  "Conquista",
  {
    titulo: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
);

Conquista.belongsTo(Jogo);
Jogo.hasMany(Conquista);

module.exports = Conquista;