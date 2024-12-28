import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.put("/:productId", updateProduct);

export const productRoutes = router;
