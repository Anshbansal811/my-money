const mongoose = require("mongoose");

let isConnected = false;

const db = async () => {
  if (isConnected) return;
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("Db Connected");
  } catch (error) {
    console.log("DB Connection Error", error);
  }
};

module.exports = { db };
