const connection = require("../config/connection");
const { DataTypes } = require("sequelize");
const Produto = require("./Produto");

const OpcaoProduto = connection.define(
  "OpcoesProduto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Produto,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shape: {
      type: DataTypes.ENUM("square", "circle"),
      allowNull: true,
      defaultValue: "square",
    },
    radius: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.ENUM("text", "color"),
      allowNull: true,
      defaultValue: "text",
    },
    values: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "opcao_produto",
    timestamps: false,
  }
);


Produto.hasMany(OpcaoProduto, { foreignKey: "produto_id" });
OpcaoProduto.belongsTo(Produto, { foreignKey: "produto_id" });

module.exports = OpcaoProduto;
