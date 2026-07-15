const express = require("express");
const cors = require("cors");

const invoiceRoutes = require("./routes/invoiceRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const vendorDashboardRoutes = require("./routes/vendorDashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/invoices", invoiceRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/vendor-dashboard", vendorDashboardRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "Agentic AP Backend Running 🚀",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});