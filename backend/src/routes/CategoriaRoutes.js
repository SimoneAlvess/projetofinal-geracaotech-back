const express = require("express");
const router = express.Router();
const CategoriaController = require("../controllers/CategoriaController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

router.get("/v1/category/search", CategoriaController.getCategoria);
router.get("/v1/category/:id", CategoriaController.getCategoriaById);
router.post("/v1/category", AuthMiddleware, CategoriaController.createCategoria);
router.put("/v1/category/:id", AuthMiddleware, CategoriaController.updateCategoria);
router.delete("/v1/category/:id", AuthMiddleware, CategoriaController.deleteCategoria);

module.exports = router;
