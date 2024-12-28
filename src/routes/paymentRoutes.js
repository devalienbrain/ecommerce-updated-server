import express from "express";
import {
  cancelledPayment,
  createPayment,
  failedPayment,
  successfulPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// Payments
router.post("/", createPayment);
router.post("/success/:tranId", successfulPayment);
router.post("/fail/:tranId", failedPayment);
router.post("/cancel/:tranId", cancelledPayment);

export const paymentRoutes = router;
