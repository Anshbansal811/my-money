import { db } from "../api/db.js";
import Income from "../api/IncomeModel.js";

export default async function handler(req, res) {
  await db();
  if (req.method === "POST") {
    // Add Income
    const { title, amount, category, description, date } = req.body;
    const income = new Income({ title, amount, category, description, date });
    try {
      if (!title || !category || !description || !date) {
        return res.status(400).json({ message: "All fields are required!" });
      }
      if (amount <= 0 || typeof amount !== "number") {
        return res
          .status(400)
          .json({ message: "Amount must be a positive number!" });
      }
      await income.save();
      res.status(200).json({ message: "Income Added" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
    return;
  }
  if (req.method === "GET") {
    // Get Incomes
    try {
      const incomes = await Income.find().sort({ createdAt: -1 });
      res.status(200).json(incomes);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
    return;
  }
  if (req.method === "DELETE") {
    // Delete Income
    const { id } = req.query;
    try {
      await Income.findByIdAndDelete(id);
      res.status(200).json({ message: "Income Deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
    return;
  }
  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
