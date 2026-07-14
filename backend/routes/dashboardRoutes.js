const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    totalInvoices: 0,
    processing: 0,
    approved: 0,
    failed: 0,
  });
});

module.exports = router;