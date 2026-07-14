const express = require("express");

const router = express.Router();

const {
  getInvoices,
  uploadInvoice,
} = require("../controllers/invoiceController");

// GET all invoices
router.get("/", getInvoices);

// POST upload invoice
router.post("/", uploadInvoice);

module.exports = router;