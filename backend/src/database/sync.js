const connection = require("../config/connection");

require("../models/Usuario");
require("../models/Produto");
require("../models/Categoria");
require("../models/ImagemProduto");
require("../models/ProdutoCategoria");
require("../models/OpcaoProduto");

connection
  .sync({ alter: true })
  .then(() => {
    console.log("Tabelas sincronizadas com sucesso");
  })
  .catch((err) => {
    console.error("Nao foi possivel sincronizar as tabelas");
  });

  