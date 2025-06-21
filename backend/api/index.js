const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { db } = require("../db/db");
const transactionsRouter = require("../routes/transactions");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

db(); // Connect to MongoDB

app.use("/api/v1", transactionsRouter);

module.exports = app;
module.exports.handler = serverless(app);
