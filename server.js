const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const app = express();
const port = 9000;
require("dotenv").config();
const connectDB = require("./config/mongodb");
const Transaction = require("./models/Transaction");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Admin Panel working on....... port ${port}`);
});

app.post("/bills", async (req, res) => {
  try {
    const date = req.body.date;
    const name = req.body.name;
    const transaction_num = req.body.transaction_num;
    const amount = req.body.amount;
    const transcationType = req.body.transcationType;

    console.log(amount);

    const newTransaction = await Transaction.create({
      date: date,
      description: name,
      transaction_number: transaction_num,
      amount: amount,
      type: transcationType,
    });
    res.send(newTransaction);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/findtransactions", async (req, res) => {
  try {
    console.log(req.query);

    const { q, limit } = req.query;

    let limitFilter = 0;
    if (limit) limitFilter = Number(limit);

    let findQuery = {};
    if (q) findQuery["$text"] = { $search: q };

    // mongodb: query $text >>> index maken op velden waarvan je tekst wil matchen.

    const findAllTransactions = await Transaction.find(findQuery).limit(
      limitFilter
    );

    res.send(findAllTransactions);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
