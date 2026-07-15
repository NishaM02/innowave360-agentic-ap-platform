const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/invoices.json");
const { addNotification } = require("./notificationController");

// Allowed extensions
const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
function updateInvoiceStatus(invoiceId) {
  const statusFlow = [
    "Processing",
    "OCR Complete",
    "PII Masked",
    "Extraction Complete",
    "Validation Complete",
    "Human Review",
    "Approved",
  ];

  statusFlow.forEach((status, index) => {
    setTimeout(() => {
      console.log(`Updating invoice ${invoiceId} to ${status}`);

      const invoices = JSON.parse(fs.readFileSync(filePath, "utf8"));

      const invoice = invoices.find(
        (item) => item.invoiceId === invoiceId
      );

      if (!invoice) return;

      invoice.status = status;

      addNotification({
  title: status,
  message: `Invoice ${invoice.invoiceNumber} moved to ${status}.`,
  type:
    status === "Approved"
      ? "success"
      : status === "Failed"
      ? "error"
      : "info",
});
      // Simulate AI Extraction
      switch (status) {
        case "OCR Complete":
          invoice.confidenceScore = 82;
          break;

        case "PII Masked":
          invoice.confidenceScore = 88;
          break;

        case "Extraction Complete":

  const vendors = [
    {
      name: "Amazon Seller Services",
      amount: 25480,
    },
    {
      name: "Reliance Retail Ltd",
      amount: 18200,
    },
    {
      name: "Dell Technologies",
      amount: 46750,
    },
    {
      name: "HP India",
      amount: 11200,
    },
    {
      name: "ABC Office Supplies Pvt Ltd",
      amount: 7670,
    },
  ];

  const randomVendor =
    vendors[Math.floor(Math.random() * vendors.length)];

  invoice.vendor = randomVendor.name;
  invoice.invoiceAmount = randomVendor.amount;
  invoice.currency = "INR";
  invoice.confidenceScore = 93;

  break;

        case "Validation Complete":
          invoice.confidenceScore = 96;
          break;

        case "Approved":
          invoice.confidenceScore = 99;
          break;

        default:
          break;
      }

      fs.writeFileSync(
        filePath,
        JSON.stringify(invoices, null, 2)
      );
    }, (index + 1) * 3000);
  });
}

// GET all invoices
const getInvoices = (req, res) => {
  try {
    const invoices = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch invoices.",
    });
  }
};

// POST new invoice
const uploadInvoice = (req, res) => {
  try {
    const { fileName, uploadedAt, fileSize } = req.body;

    // Validate filename
    if (!fileName) {
      return res.status(400).json({
        message: "File name is required.",
      });
    }

    // Validate upload date
    if (!uploadedAt) {
      return res.status(400).json({
        message: "Upload date is required.",
      });
    }

    // Validate extension
    const extension = path.extname(fileName).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return res.status(415).json({
        message: "Only PDF, PNG and JPG files are allowed.",
      });
    }

    // Validate file size (10 MB)
    if (fileSize && fileSize > 10 * 1024 * 1024) {
      return res.status(400).json({
        message: "Maximum file size is 10 MB.",
      });
    }

    const invoices = JSON.parse(
  fs.readFileSync(filePath, "utf8")
);

// Check duplicate invoice
const duplicateInvoice = invoices.find(
  (invoice) =>
    invoice.fileName === fileName &&
    invoice.fileSize === fileSize
);

if (duplicateInvoice) {
  return res.status(409).json({
    message: "This invoice has already been uploaded.",
  });
}

const invoiceId = Date.now();

const newInvoice = {
  invoiceId,

  invoiceNumber: `INV-${invoiceId}`,

  vendor: "Unknown Vendor",

  fileName,

  fileSize,

  uploadedAt,

  status: "Uploaded",

  confidenceScore: 0,

  invoiceAmount: 0,

  currency: "INR",
};
    invoices.push(newInvoice);

    fs.writeFileSync(
  filePath,
  JSON.stringify(invoices, null, 2)
);

updateInvoiceStatus(invoiceId);

return res.status(201).json(newInvoice);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Something went wrong while uploading the invoice.",
    });

  }
};

module.exports = {
  getInvoices,
  uploadInvoice,
};