const { Router } = require("express");
const { getAllProducts, createProduct, editproduct } = require("../controllers/products.controllers");
const upload = require("../middlewares/upload.middleware");
const authenticate = require("../middlewares/auth.middleware");

const router = Router();

router.post( "/product",authenticate, upload.single("imagep"), createProduct)

router.put("/product/:id", authenticate, editproduct);

router.get("/products", getAllProducts);

module.exports = router;
