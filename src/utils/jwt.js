import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  // Check if the 'Authorization' header exists
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  // Ensure token starts with 'Bearer '
  if (!token.startsWith("Bearer ")) {
    return res
      .status(400)
      .send("Invalid token format. Token should start with 'Bearer '");
  }

  try {
    // Remove the 'Bearer ' prefix and verify the token
    const verified = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    // Attach the user ID and role to the request object
    req.userId = verified.id;
    req.userRole = verified.role;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle invalid or expired token
    res.status(400).send("Invalid or expired token");
  }
};
