import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createCategory = async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
  
    try {
      const category = await prisma.category.create({
        data: { name },
      });
      res.status(201).json(category);
    } catch (error) {
      console.error("Category Creation Error:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  };

  export const getAllCategories = async (req, res) => {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  };

  export const editCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
  
    try {
      const category = await prisma.category.update({
        where: { id: Number(id) },
        data: { name },
      });
      res.status(200).json(category);
    } catch (error) {
      console.error("Category Update Error:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  };

  export const deleteCategory = async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.category.delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Category Deletion Error:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  };
  