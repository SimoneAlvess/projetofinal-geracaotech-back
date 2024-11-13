const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

router.get("/v1/user", UsuarioController.getUsuario);
router.get("/v1/user/:id", UsuarioController.getUsuarioById);
router.post("/v1/user", UsuarioController.createUsuario);
router.put("/v1/user/:id", AuthMiddleware, UsuarioController.updateUsuario);
router.delete("/v1/user/:id", AuthMiddleware, UsuarioController.deleteUsuario);

module.exports = router;