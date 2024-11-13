const express = require("express");
const cors = require("cors");
const app = express();
const UsuarioRoutes = require("./routes/UsuarioRoutes");
const AuthRoutes = require("./routes/AuthRoutes");
const CategoriaRoutes = require("./routes/CategoriaRoutes");
const ProdutoRoutes = require("./routes/ProdutoRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bem vindo a Digital Store!");
})

app.use("/", AuthRoutes);
app.use("/", UsuarioRoutes);
app.use("/", CategoriaRoutes);
app.use("/", ProdutoRoutes);


module.exports = app;