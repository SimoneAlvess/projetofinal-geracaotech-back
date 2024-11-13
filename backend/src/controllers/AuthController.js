const UsuarioService = require("../services/UsuarioService");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await UsuarioService.login(email, password);
    res.status(200).json({ token });
  } catch (error) {
    if (error.message === "Usuário não encontrado" || error.message === "Credenciais inválidas") {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = { login };
