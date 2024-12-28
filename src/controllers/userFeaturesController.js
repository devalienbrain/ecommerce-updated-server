import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all orders for a user
export const getOrders = async (req, res) => {
  const { userId } = req.query;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId, 10) },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};
// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({});
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

// Add an order
export const addOrder = async (req, res) => {
  const { userId, productId, quantity, totalPrice } = req.body;

  try {
    const order = await prisma.order.create({
      data: { userId, productId, quantity, totalPrice },
    });
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

// Get cart items for a user
export const getCartItems = async (req, res) => {
  const { userId } = req.query;

  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId: parseInt(userId, 10) },
      include: { product: true },
    });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items." });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cartItem = await prisma.cart.create({
      data: { userId, productId, quantity },
    });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart." });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.cart.delete({ where: { id: parseInt(id, 10) } });
    res.status(200).json({ message: "Item removed from cart." });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart." });
  }
};

// Get recently viewed products
export const getRecentlyViewed = async (req, res) => {
  const { userId } = req.query;

  try {
    const recentlyViewed = await prisma.recentlyViewed.findMany({
      where: { userId: parseInt(userId, 10) },
      include: { product: true },
    });
    res.status(200).json(recentlyViewed);
  } catch (error) {
    console.error("Error fetching recently viewed:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch recently viewed products." });
  }
};

// Add to recently viewed
export const addRecentlyViewed = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const recentlyViewed = await prisma.recentlyViewed.create({
      data: { userId, productId },
    });
    res.status(201).json(recentlyViewed);
  } catch (error) {
    console.error("Error adding to recently viewed:", error);
    res.status(500).json({ error: "Failed to add to recently viewed." });
  }
};

// Get user reviews
export const getMyReviews = async (req, res) => {
  const { userId } = req.query;

  try {
    const reviews = await prisma.review.findMany({
      where: { userId: parseInt(userId, 10) },
      include: { product: true },
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
};

// Add a review
export const addReview = async (req, res) => {
  const { userId, productId, rating, comment } = req.body;

  try {
    const review = await prisma.review.create({
      data: {
        userId: parseInt(userId, 10), // Ensure userId is an integer
        productId: parseInt(productId, 10), // Ensure productId is an integer
        rating: parseInt(rating, 10), // Ensure rating is an integer
        comment,
      },
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review." });
  }
};
