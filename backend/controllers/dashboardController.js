const fs = require("fs");
const path = require("path");
const averageProcessingTime =
  `${(15 + Math.floor(Math.random() * 10))} sec`;

const invoiceFile = path.join(
  __dirname,
  "../data/invoices.json"
);

const getDashboardStats = (req, res) => {
  try {
    const invoices = JSON.parse(
      fs.readFileSync(invoiceFile, "utf8")
    );
    const invoicesPerDay = {};

invoices.forEach((invoice) => {
  const date = new Date(invoice.uploadedAt).toLocaleDateString("en-GB");

  invoicesPerDay[date] =
    (invoicesPerDay[date] || 0) + 1;
});
const vendorCounts = {};

invoices.forEach((invoice) => {
  const vendor = invoice.vendor || "Unknown Vendor";

  vendorCounts[vendor] =
    (vendorCounts[vendor] || 0) + 1;
});

   const stats = {
  totalInvoices: invoices.length,

  processing: invoices.filter(
    (invoice) => invoice.status === "Processing"
  ).length,

  humanReview: invoices.filter(
    (invoice) => invoice.status === "Human Review"
  ).length,

  approved: invoices.filter(
    (invoice) => invoice.status === "Approved"
  ).length,

  failed: invoices.filter(
    (invoice) => invoice.status === "Failed"
  ).length,
  invoicesPerDay: Object.entries(invoicesPerDay).map(
  ([date, count]) => ({
    date,
    count,
  })
),
averageProcessingTime,
vendorWiseCount: Object.entries(vendorCounts).map(
  ([vendor, count]) => ({
    vendor,
    count,
  })
),
  statusDistribution: [
    {
      name: "Approved",
      value: invoices.filter(
        (invoice) => invoice.status === "Approved"
      ).length,
    },
    {
      name: "Processing",
      value: invoices.filter(
        (invoice) => invoice.status === "Processing"
      ).length,
    },
    {
      name: "Human Review",
      value: invoices.filter(
        (invoice) => invoice.status === "Human Review"
      ).length,
    },
    {
      name: "Failed",
      value: invoices.filter(
        (invoice) => invoice.status === "Failed"
      ).length,
    },
  ],
};


    res.status(200).json(stats);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Unable to fetch dashboard statistics.",
    });

  }
};

module.exports = {
  getDashboardStats,
};