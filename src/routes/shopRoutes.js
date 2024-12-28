import express from "express";
import {
  createShop,
  deleteShop,
  getShop,
  updateShop,
} from "../controllers/shopController.js";

const router = express.Router();

router.get("/", getShop);
router.post("/", createShop);
router.patch("/:id", updateShop);
router.delete("/:id", deleteShop);

export const shopRoutes = router;
