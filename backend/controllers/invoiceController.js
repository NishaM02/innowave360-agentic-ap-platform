const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/invoices.json");

// GET all invoices
const getInvoices = (req, res) => {
  const invoices = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(invoices);
};

// POST new invoice
const uploadInvoice = (req, res) => {
  const invoices = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const newInvoice = {
    invoiceId: Date.now(),
    fileName: req.body.fileName,
    uploadedAt: req.body.uploadedAt,
    status: "UPLOADED",
  };

  invoices.push(newInvoice);

  fs.writeFileSync(filePath, JSON.stringify(invoices, null, 2));

  res.json(newInvoice);
};

module.exports = {
  getInvoices,
  uploadInvoice,
};