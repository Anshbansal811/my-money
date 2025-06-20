const ExpenseSchema = require("../models/ExpenseModel");
const IncomeSchema = require("../models/IncomeModel");
const ExcelJS = require("exceljs");

exports.addExpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  const income = ExpenseSchema({
    title,
    amount,
    category,
    description,
    date,
  });

  try {
    //validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }
    await income.save();
    res.status(200).json({ message: "Expense Added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }

  console.log(income);
};

exports.getExpense = async (req, res) => {
  try {
    const incomes = await ExpenseSchema.find().sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  ExpenseSchema.findByIdAndDelete(id)
    .then((income) => {
      res.status(200).json({ message: "Expense Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error" });
    });
};

// Download all incomes and expenses as Excel file with three sheets (Summary, Incomes, Expenses)
exports.downloadExpensesCSV = async (req, res) => {
  try {
    const expenses = await ExpenseSchema.find().sort({ createdAt: -1 });
    const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
    if (!expenses.length && !incomes.length) {
      return res.status(404).send("No data found");
    }
    // Calculate totals
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
    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=statement.xlsx");
    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
