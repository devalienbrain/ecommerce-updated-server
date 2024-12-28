import express from "express";
import {
  deleteUser,
  getAllUser,
  getUser,
  suspendUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", getUser);
router.patch("/:id/suspend", suspendUser);
router.delete("/:id", deleteUser);

export const userRoutes = router;
