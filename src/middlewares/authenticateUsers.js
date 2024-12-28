export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from header

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validate token
    req.user = decoded; // Attach the decoded user info to the request object
    next(); // Proceed to the next middleware/handler
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
