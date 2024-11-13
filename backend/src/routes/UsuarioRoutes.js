const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

router.get("/usuario", UsuarioController.getUsuario);
router.get("/usuario/:id", UsuarioController.getUsuarioById);
router.post("/usuario", UsuarioController.createUsuario);
router.put("/usuario/:id", AuthMiddleware, UsuarioController.updateUsuario);
router.delete("/usuario/:id", AuthMiddleware, UsuarioController.deleteUsuario);

module.exports = router;