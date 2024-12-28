import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  // Basic validation
  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if role is valid
    const validRoles = ["user", "vendor", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found." });

    console.log(user);

    const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials." });
    }
    console.log("Password matches:", isMatch);
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log({ token });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
