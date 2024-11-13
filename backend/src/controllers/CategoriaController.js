const CategoriaService = require("../services/CategoriaService");

const getCategoria = (req, res) => CategoriaService.getCategoria(req, res);
const getCategoriaById = (req, res) => CategoriaService.getCategoriaById(req, res);
const createCategoria = (req, res) => CategoriaService.createCategoria(req, res);
const updateCategoria = (req, res) => CategoriaService.updateCategoria(req, res);
const deleteCategoria = (req, res) => CategoriaService.deleteCategoria(req, res);

module.exports = { getCategoria, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };