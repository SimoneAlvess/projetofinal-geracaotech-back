const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/ProdutoController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

router.get("/produto", ProdutoController.getProdutos);
router.get("/produto/:id", ProdutoController.getProdutoById);
router.post("/produto", AuthMiddleware, ProdutoController.createProduto);
router.put("/produto/:id", AuthMiddleware, ProdutoController.updateProduto);
router.delete("/produto/:id", AuthMiddleware, ProdutoController.deleteProduto);

module.exports = router;