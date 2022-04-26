const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  date: "string",
  description: "string",
  transaction_number: "string",
  amount: "number",
  type: "string",
});

schema.index({
  description: "text",
});

const Transaction = mongoose.model("Transaction", schema);

module.exports = Transaction;
