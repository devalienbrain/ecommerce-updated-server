import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get the current shop(s) for the vendor
export const getShop = async (req, res) => {
  const { userId } = req.query; // Read from query params

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const shops = await prisma.shop.findMany({
      where: { vendorId: parseInt(userId, 10) }, // Ensure userId is parsed as an integer
    });

    if (!shops.length) {
      return res.status(404).json({ error: "No shops found for this vendor." });
    }

    res.status(200).json(shops); // Return all shops
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ error: "Failed to fetch shop details." });
  }
};

// Create a new shop for the vendor
export const createShop = async (req, res) => {
  const { name, logo, description, userId } = req.body;
  console.log(name, logo, description, userId);
  if (!userId || !name || !description) {
    return res
      .status(400)
      .json({ error: "User ID, name, and description are required." });
  }

  try {
    const shop = await prisma.shop.create({
      data: {
        name,
        logo,
        description,
        vendorId: userId,
      },
    });

    res.status(201).json(shop);
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ error: "Failed to create shop." });
  }
};

// Update the existing shop for the vendor
export const updateShop = async (req, res) => {
  const { id } = req.params;
  const { name, logo, description } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Shop ID is required." });
  }

  if (!name || !description) {
    return res
      .status(400)
      .json({ error: "Name and description are required." });
  }

  try {
    const shop = await prisma.shop.update({
      where: { id: parseInt(id) },
      data: {
        name,
        logo,
        description,
      },
    });

    res.status(200).json(shop);
  } catch (error) {
    console.error("Error updating shop:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Shop not found." });
    }
    res.status(500).json({ error: "Failed to update shop." });
  }
};

// Delete the shop
export const deleteShop = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Shop ID is required." });
  }

  try {
    await prisma.shop.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Shop deleted successfully." });
  } catch (error) {
    console.error("Error deleting shop:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Shop not found." });
    }
    res.status(500).json({ error: "Failed to delete shop." });
  }
};
