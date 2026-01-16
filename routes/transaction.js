const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transactions");
const auth = require("../middleware/auth");

router.post("/createTransaction", auth, async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});

router.get("/transaction", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

router.put("/updateTransaction/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(transaction);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

router.delete("/deleteTransaction/:id", auth, async (req, res) => {
  try {
    await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
