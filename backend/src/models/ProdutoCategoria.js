const connection = require("../config/connection");
const { DataTypes } = require("sequelize");
const Produto = require("./Produto");
const Categoria = require("./Categoria");

const ProdutoCategoria = connection.define(
  "ProdutoCategoria",
  {
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Produto,
        key: "id",
      },
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Categoria,
        key: "id",
      },
    },
  },
  {
    tableName: "produto_categoria",
    timestamps: false,
  }
);

Produto.belongsToMany(Categoria, { through: ProdutoCategoria, foreignKey: "produto_id"});
Categoria.belongsToMany(Produto, { through: ProdutoCategoria, foreignKey: "categoria_id" });

module.exports = ProdutoCategoria;