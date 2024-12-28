import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { shopRoutes } from "./routes/shopRoutes.js";
import { userFeaturesRoutes } from "./routes/userFeaturesRoutes.js";
import { paymentRoutes } from "./routes/paymentRoutes.js";

const app = express();

// Paymemnt sslcommerz integration part
export const store_id = process.env.SSLCOMMERZ_STORE_ID;
export const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
export const is_live = false; //true for live, false for sandbox

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ecommerce-frontend-gold-mu.vercel.app",
    ],
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api", userFeaturesRoutes);
app.use("/api/payment", paymentRoutes);

export default app;
