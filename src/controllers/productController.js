import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  const { name, price, categoryId, inventory, image, createdBy } = req.body;

  if (!createdBy || !categoryId) {
    return res
      .status(400)
      .json({ error: "Missing required fields: createdBy or categoryId" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price), // Ensure price is a number
        inventory: parseInt(inventory, 10), // Ensure inventory is a number
        image,
        User: {
          connect: { id: parseInt(createdBy, 10) }, // Link product to a user
        },
        Category: {
          connect: { id: parseInt(categoryId, 10) }, // Link product to a category
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Product Creation Error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getAllProducts = async (req, res) => {
  const { category } = req.query;

  try {
    const products = category
      ? await prisma.product.findMany({
          where: {
            Category: {
              id: parseInt(category, 10),
            },
          },
          include: {
            Category: true,
          },
        })
      : await prisma.product.findMany({
          include: {
            Category: true,
          },
        });

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// function to fetch a single product by ID
export const getProductById = async (req, res) => {
  const { productId } = req.params; // Get productId from request params

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId, 10) },
      include: {
        Category: true, // Include category if needed
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Update product details by productId
export const updateProduct = async (req, res) => {
  const { productId } = req.params; // Get productId from request params
  const { name, price, inventory, image, categoryId } = req.body; // Get updated data from request body

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(productId, 10) }, // Find the product by ID
      data: {
        name,
        price: parseFloat(price), // Ensure price is a number
        inventory: parseInt(inventory, 10), // Ensure inventory is a number
        image,
        categoryId: categoryId ? parseInt(categoryId, 10) : undefined, // Update category if provided
        updatedAt: new Date(), // Automatically update timestamp
      },
    });

    res.status(200).json(product); // Return the updated product
  } catch (error) {
    console.error("Product Update Error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};
