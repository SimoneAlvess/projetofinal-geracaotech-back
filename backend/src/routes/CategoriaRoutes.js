const express = require("express");
const router = express.Router();
const CategoriaController = require("../controllers/CategoriaController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

router.get("/categoria/search", CategoriaController.getCategoria);
router.get("/categoria/:id", CategoriaController.getCategoriaById);
router.post("/categoria", AuthMiddleware, CategoriaController.createCategoria);
router.put("/categoria/:id", AuthMiddleware, CategoriaController.updateCategoria);
router.delete("/categoria/:id", AuthMiddleware, CategoriaController.deleteCategoria);

module.exports = router;
