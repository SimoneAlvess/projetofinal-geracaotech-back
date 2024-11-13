const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//LOGIN
const login = async (email, password) => {
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  const isPasswordValid = await bcrypt.compare(password, usuario.password);
  if (!isPasswordValid) {
    throw new Error("Credenciais inválidas");
  }
  //TEMPO DE EXPIRACAO DO TOKEN
  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

//LISTAGEM DE TODOS OS USUÁRIOS
const getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findAll(
      {
        attributes: ["id", "firstname", "surname", "email"],
      }
    ); 
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

//LISTAGEM POR ID
const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json({
      id: usuario.id,
      firstname: usuario.firstname,
      surname: usuario.surname,
      email: usuario.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

//CRIAR USUÁRIO
const createUsuario = async (req, res) => {
  const { firstname, surname, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "As senhas não coincidem" });
  }
  try {
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: "Email já cadastrado, informar outro email" });
    }
    //CRIPTOGRAFIA DE SENHA
    const hashPassword = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      firstname,
      surname,
      email,
      password: hashPassword,
    });
    
    res.status(201).json({
      id: usuario.id,
      firstname: usuario.firstname,
      surname: usuario.surname,
      email: usuario.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

//ATUALIZAR USUÁRIO
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { firstname, surname, email } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    usuario.firstname = firstname;
    usuario.surname = surname;
    usuario.email = email;
    await usuario.save();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Dados de requisição inválidos" });
  }
};

//DELETAR USUÁRIO
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    await usuario.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = { login, getUsuario, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };
