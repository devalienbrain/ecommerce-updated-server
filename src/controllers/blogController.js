import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new blog
export const createBlog = async (req, res) => {
  const { title, details, imageUrl, author } = req.body;

  if (!title || !details || !imageUrl || !author) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const blog = await prisma.blog.create({
      data: { title, details, imageUrl, author, createdAt: new Date() },
    });
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};
