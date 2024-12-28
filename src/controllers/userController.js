import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUser = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await prisma.user.findMany();

    // Exclude password for each user
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    return res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Do not send the password
    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const suspendUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { status: "suspended" }, // Assuming you add a 'status' field to your User model
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to suspend user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete user by ID
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });

    // Respond with success message and deleted user data
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    // Handle errors during deletion
    res.status(500).json({ error: "Failed to delete user" });
  }
};
