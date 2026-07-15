const fs = require("fs");
const path = require("path");

const vendorFile = path.join(
  __dirname,
  "../data/vendors.json"
);

// GET all vendors
const getVendors = (req, res) => {
  try {
    const vendors = JSON.parse(
      fs.readFileSync(vendorFile, "utf8")
    );

    res.status(200).json(vendors);

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch vendors.",
    });
  }
};

// CREATE vendor
const createVendor = (req, res) => {
  try {
    const {
      vendorName,
      vendorCode,
      gstNumber,
      panNumber,
      email,
      phone,
      country,
      status,
    } = req.body;

    // Required fields validation
    if (
      !vendorName ||
      !vendorCode ||
      !gstNumber ||
      !panNumber ||
      !email ||
      !phone ||
      !country ||
      !status
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const vendors = JSON.parse(
      fs.readFileSync(vendorFile, "utf8")
    );

    // Duplicate vendor code
    const exists = vendors.find(
      (vendor) => vendor.vendorCode === vendorCode
    );

    if (exists) {
      return res.status(409).json({
        message: "Vendor Code already exists.",
      });
    }

    const newVendor = {
      id: Date.now(),
      vendorName,
      vendorCode,
      gstNumber,
      panNumber,
      email,
      phone,
      country,
      status,
      createdAt: new Date().toISOString(),
    };

    vendors.push(newVendor);

    fs.writeFileSync(
      vendorFile,
      JSON.stringify(vendors, null, 2)
    );

    res.status(201).json(newVendor);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create vendor.",
    });
  }
};
const deleteVendor = (req, res) => {
  try {
    const { id } = req.params;

    const vendors = JSON.parse(
      fs.readFileSync(vendorFile, "utf8")
    );

    const updatedVendors = vendors.filter(
      (vendor) => vendor.id != id
    );

    fs.writeFileSync(
      vendorFile,
      JSON.stringify(updatedVendors, null, 2)
    );

    res.status(200).json({
      message: "Vendor deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to delete vendor.",
    });
  }
};

const updateVendor = (req, res) => {
  try {
    const { id } = req.params;

    const vendors = JSON.parse(
      fs.readFileSync(vendorFile, "utf8")
    );

    const vendorIndex = vendors.findIndex(
      (vendor) => vendor.id == id
    );

    if (vendorIndex === -1) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    vendors[vendorIndex] = {
      ...vendors[vendorIndex],
      ...req.body,
    };

    fs.writeFileSync(
      vendorFile,
      JSON.stringify(vendors, null, 2)
    );

    res.status(200).json({
      message: "Vendor updated successfully.",
      vendor: vendors[vendorIndex],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update vendor.",
    });
  }
};
module.exports = {
  getVendors,
  createVendor,
deleteVendor,
 updateVendor,
};