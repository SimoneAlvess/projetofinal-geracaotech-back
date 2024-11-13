const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/ProdutoController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

router.get("/v1/product/search", ProdutoController.getProdutos);
router.get("/v1/product/:id", ProdutoController.getProdutoById);
router.post("/v1/product", AuthMiddleware, ProdutoController.createProduto);
router.put("/v1/product/:id", AuthMiddleware, ProdutoController.updateProduto);
router.delete("/v1/product/:id", AuthMiddleware, ProdutoController.deleteProduto);

module.exports = router;