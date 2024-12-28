import { PrismaClient } from "@prisma/client";
import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";
import { is_live, store_id, store_passwd } from "../app.js";


const prisma = new PrismaClient();
export const createPayment = async (req, res) => {
  const {
    userId,
    userEmail,
    userName = "N/A",
    userPhone = "N/A",
    userAddress = "N/A",
    totalPriceToPay,
    productIds = [], // Optional array of product IDs
  } = req.body;

  // Validate required fields
  if (!userId || !userEmail || !totalPriceToPay) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Validate user existence
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate the products if product IDs are provided
    let products = [];
    if (productIds.length > 0) {
      products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      if (products.length !== productIds.length) {
        return res.status(400).json({ error: "Some products were not found." });
      }
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } }, // Connect existing user by userId
        totalPrice: totalPriceToPay,
        status: "pending",
        products: {
          connect: products.map((product) => ({ id: product.id })), // Connect products to the order
        },
      },
      include: {
        products: true, // Include product details in the response
      },
    });

    // return res.status(201).json({
    //   message: "Order created successfully",
    //   order,
    // });

    // SSLCommerz Payment integration Starts here
    const tranId = `REF${uuidv4().slice(0, 8).toUpperCase()}`;

    const data = {
      total_amount: totalPriceToPay,
      currency: "BDT",
      tran_id: tranId, // use unique tran_id for each api call
      success_url: `${process.env.SERVER_URL}/api/payment/success/${tranId}`,
      fail_url: `${process.env.SERVER_URL}/api/payment/fail/${tranId}`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/cancel/${tranId}`,
      ipn_url: `${process.env.SERVER_URL}/ipn`,
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: "Customer Name",
      cus_email: "customer@example.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({ url: GatewayPageURL });
      console.log("Redirecting to: ", GatewayPageURL);
    });
    // SSLCommerz Payment integration Ends here
  } catch (error) {
    console.error("Error creating order:", error.message || error);
    return res.status(500).json({ error: "Failed to create order." });
  } finally {
    // await prisma.$disconnect();
  }
};

export const successfulPayment = async (req, res) => {
  const { tranId } = req.params;

  try {
    // Find the order by tranId and update the status to 'success'
    const order = await prisma.order.updateMany({
      where: { id: tranId },
      data: { status: "success" },
    });

    // Empty the cart after success
    await prisma.cart.deleteMany({
      where: { userId: order.userId },
    });

    res.redirect(
      `${process.env.CLIENT_URL}/dashboard/payment/success/${tranId}`
    );
  } catch (error) {
    console.error("Error updating payment status:", error);
    res
      .status(500)
      .json({ error: "Failed to process the successful payment." });
  }
};

export const failedPayment = async (req, res) => {
  const { tranId } = req.params;

  try {
    // Find the order by tranId and update the status to 'failed'
    await prisma.order.updateMany({
      where: { id: tranId },
      data: { status: "failed" },
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard/payment/fail/${tranId}`);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Failed to process the failed payment." });
  }
};

export const cancelledPayment = async (req, res) => {
  const { tranId } = req.params;

  try {
    // Find the order by tranId and update the status to 'cancelled'
    await prisma.order.updateMany({
      where: { id: tranId },
      data: { status: "cancelled" },
    });

    res.redirect(
      `${process.env.CLIENT_URL}/dashboard/payment/cancel/${tranId}`
    );
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Failed to process the cancelled payment." });
  }
};
