import express from "express";
import {
  getOrders,
  addOrder,
  getCartItems,
  addToCart,
  removeFromCart,
  getRecentlyViewed,
  addRecentlyViewed,
  getMyReviews,
  addReview,
  getAllOrders,
} from "../controllers/userFeaturesController.js";

const router = express.Router();

// Orders
router.get("/orders", getOrders);
router.get("/allOrders", getAllOrders);
router.post("/orders", addOrder);

// Cart
router.get("/cart", getCartItems);
router.post("/cart", addToCart);
router.delete("/cart/:id", removeFromCart);

// Recently Viewed
router.get("/recently-viewed", getRecentlyViewed);
router.post("/recently-viewed", addRecentlyViewed);

// Reviews
router.get("/reviews", getMyReviews);
router.post("/reviews", addReview);

export const userFeaturesRoutes = router;
