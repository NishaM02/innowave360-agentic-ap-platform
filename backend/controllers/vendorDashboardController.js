
const fs = require("fs");
const path = require("path");

const vendorFile = path.join(
  __dirname,
  "../data/vendors.json"
);

const getVendorDashboard = (req, res) => {
  try {
    const vendors = JSON.parse(
      fs.readFileSync(vendorFile, "utf8")
    );

    // Dashboard Cards
    const totalVendors = vendors.length;

    const activeVendors = vendors.filter(
      (vendor) => vendor.status === "Active"
    ).length;

    const inactiveVendors = vendors.filter(
      (vendor) => vendor.status === "Inactive"
    ).length;

    const awaitingApproval = vendors.filter(
      (vendor) => vendor.status === "Awaiting Approval"
    ).length;

    // -----------------------------
    // Vendor Country Distribution
    // -----------------------------
    const countryMap = {};

    vendors.forEach((vendor) => {
      countryMap[vendor.country] =
        (countryMap[vendor.country] || 0) + 1;
    });

    const countryDistribution = Object.keys(countryMap).map((country) => ({
      name: country,
      value: countryMap[country],
    }));

    // -----------------------------
    // Monthly Vendor Creation
    // -----------------------------
    const monthlyMap = {};

    vendors.forEach((vendor) => {
      if (!vendor.createdAt) return;

      const month = new Date(vendor.createdAt).toLocaleString("default", {
        month: "short",
      });

      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });

    const monthlyVendorCreation = Object.keys(monthlyMap).map((month) => ({
      month,
      count: monthlyMap[month],
    }));

    // -----------------------------
    // Top Vendors by Invoice Count
    // (Dummy data for assignment)
    // -----------------------------
    const topVendors = vendors
      .map((vendor) => ({
        vendor: vendor.vendorName,
        invoiceCount: Math.floor(Math.random() * 40) + 10,
      }))
      .sort((a, b) => b.invoiceCount - a.invoiceCount)
      .slice(0, 5);

    res.status(200).json({
      totalVendors,
      activeVendors,
      inactiveVendors,
      awaitingApproval,
      countryDistribution,
      monthlyVendorCreation,
      topVendors,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to fetch vendor dashboard.",
    });
  }
};

module.exports = {
  getVendorDashboard,
};

