const connection = require("../config/connection");
const { DataTypes } = require("sequelize");
const Produto = require("./Produto");

const ImagemProduto = connection.define(
  "ImagemProduto",
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
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "imagem_produto",
    timestamps: false,
  }
);

Produto.hasMany(ImagemProduto, { foreignKey: "produto_id" });
ImagemProduto.belongsTo(Produto, { foreignKey: "produto_id" });

module.exports = ImagemProduto;
