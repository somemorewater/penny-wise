const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');
const auth = require("../middleware/auth");

router.post("/createTransaction", auth, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      description
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Failed to create transaction" });
  }
});


router.post("/createTransaction", async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
