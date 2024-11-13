const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de autenticação ausente" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: "Token de autenticação inválido" });
    req.user = user;
    next();
  });
};

module.exports = AuthMiddleware;
