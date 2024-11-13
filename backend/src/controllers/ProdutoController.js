const ProdutoService = require("../services/ProdutoService");

const getProdutos = (req, res) => ProdutoService.getProdutos(req, res);
const getProdutoById = (req, res) => ProdutoService.getProdutoById(req, res);
const createProduto = (req, res) => ProdutoService.createProduto(req, res);
const updateProduto = (req, res) => ProdutoService.updateProduto(req, res);
const deleteProduto = (req, res) => ProdutoService.deleteProduto(req, res);


module.exports = { getProdutos, getProdutoById, createProduto, updateProduto, deleteProduto };