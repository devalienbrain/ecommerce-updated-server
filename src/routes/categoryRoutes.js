import express from "express";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getAllCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.patch("/:id", editCategory);
router.delete("/:id", deleteCategory);

export const categoryRoutes = router;
