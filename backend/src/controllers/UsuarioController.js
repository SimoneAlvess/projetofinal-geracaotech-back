const UsuarioService = require("../services/UsuarioService");

const getUsuario = (req, res) => UsuarioService.getUsuario(req, res);
const getUsuarioById = (req, res) => UsuarioService.getUsuarioById(req, res);
const createUsuario = (req, res) => UsuarioService.createUsuario(req, res);
const updateUsuario = (req, res) => UsuarioService.updateUsuario(req, res);
const deleteUsuario = (req, res) => UsuarioService.deleteUsuario(req, res);

module.exports = { getUsuario, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };