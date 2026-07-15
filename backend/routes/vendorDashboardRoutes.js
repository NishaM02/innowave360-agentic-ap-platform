const express = require("express");

const router = express.Router();

const {
  getVendorDashboard,
} = require("../controllers/vendorDashboardController");

router.get("/", getVendorDashboard);

module.exports = router;