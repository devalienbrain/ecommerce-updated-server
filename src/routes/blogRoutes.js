import express from "express";
import { createBlog, getAllBlogs } from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.post("/", createBlog);

export const blogRoutes = router;
