const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { db } = require("../backend/db/db");
const transactionsRouter = require("../backend/routes/transactions");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// Connect to DB (ensure this only runs once per cold start)
db();

// Mount your routes
app.use("/api/v1", transactionsRouter);

module.exports = app;
module.exports.handler = serverless(app);