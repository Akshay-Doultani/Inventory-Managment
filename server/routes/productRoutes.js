const express = require("express");
const { createProduct, getProducts, updateProductStatus, deleteProduct, getProductById, updateProduct } = require("../controllers/ProductController");

const router = express.Router();

router.post("/products", createProduct);
router.get("/products", getProducts);
router.get("/products/:serialNumber", getProductById);
router.delete("/products/:id", deleteProduct);
router.patch("/products/:serialNumber", updateProductStatus);
router.put("/products", updateProduct);
module.exports = router;
