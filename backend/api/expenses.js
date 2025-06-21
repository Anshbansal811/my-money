import { db } from "../api/db.js";
import Expense from "../api/ExpenseModel.js";
import Income from "../api/IncomeModel.js";
import ExcelJS from "exceljs";

export default async function handler(req, res) {
  await db();
  if (req.method === "POST") {
    // Add Expense
    const { title, amount, category, description, date } = req.body;
    const expense = new Expense({ title, amount, category, description, date });
    try {
      if (!title || !category || !description || !date) {
        return res.status(400).json({ message: "All fields are required!" });
      }
      if (amount <= 0 || typeof amount !== "number") {
        return res
          .status(400)
          .json({ message: "Amount must be a positive number!" });
      }
      await expense.save();
      res.status(200).json({ message: "Expense Added" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
    return;
  }
  if (req.method === "GET") {
    // Get Expenses
    try {
      const expenses = await Expense.find().sort({ createdAt: -1 });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
    return;
  }
  if (req.method === "DELETE") {
    // Delete Expense
    const { id } = req.query;
    try {
      await Expense.findByIdAndDelete(id);
      res.status(200).json({ message: "Expense Deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
    return;
  }
  if (req.method === "PATCH" && req.query.download === "excel") {
    // Download Excel
    try {
      const expenses = await Expense.find().sort({ createdAt: -1 });
      const incomes = await Income.find().sort({ createdAt: -1 });
      if (!expenses.length && !incomes.length) {
        return res.status(404).send("No data found");
      }
      const totalIncome = incomes.reduce(
        (sum, inc) => sum + (inc.amount || 0),
        0
      );
      const totalExpenses = expenses.reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0
      );
      const balance = totalIncome - totalExpenses;
      const workbook = new ExcelJS.Workbook();
      // Summary Sheet
      const summarySheet = workbook.addWorksheet("Summary");
      summarySheet.columns = [
        { header: "Type", key: "type", width: 20 },
        { header: "Amount", key: "amount", width: 20 },
      ];
      summarySheet.addRow({ type: "Total Income", amount: totalIncome });
      summarySheet.addRow({ type: "Total Expenses", amount: totalExpenses });
      summarySheet.addRow({ type: "Balance", amount: balance });
      summarySheet.getRow(1).font = { bold: true };
      summarySheet.getRow(2).font = { bold: true };
      summarySheet.getRow(3).font = { bold: true };
      // Incomes Sheet
      const incomeSheet = workbook.addWorksheet("Incomes");
      incomeSheet.columns = [
        { header: "Title", key: "title", width: 30 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Description", key: "description", width: 30 },
        { header: "Date", key: "date", width: 25 },
      ];
      incomes.forEach((inc) => {
        incomeSheet.addRow({
          title: inc.title,
          amount: inc.amount,
          category: inc.category,
          description: inc.description,
          date: inc.date instanceof Date ? inc.date.toISOString() : inc.date,
        });
      });
      // Expenses Sheet
      const expenseSheet = workbook.addWorksheet("Expenses");
      expenseSheet.columns = [
        { header: "Title", key: "title", width: 30 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Description", key: "description", width: 30 },
        { header: "Date", key: "date", width: 25 },
      ];
      expenses.forEach((exp) => {
        expenseSheet.addRow({
          title: exp.title,
          amount: exp.amount,
          category: exp.category,
          description: exp.description,
          date: exp.date instanceof Date ? exp.date.toISOString() : exp.date,
        });
      });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=statement.xlsx"
      );
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
    return;
  }
  res.setHeader("Allow", ["GET", "POST", "DELETE", "PATCH"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
