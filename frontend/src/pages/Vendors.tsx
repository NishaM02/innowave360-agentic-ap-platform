import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import VendorDetailsModal from "../components/VendorDetailsModal";
import { Search } from "lucide-react";
import { vendorSchema } from "../validations/vendorSchema";

interface Vendor {
  id: number;
  vendorName: string;
  vendorCode: string;
  gstNumber: string;
  panNumber: string;
  email: string;
  phone: string;
  country: string;
  status: string;
}

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
const [isViewOpen, setIsViewOpen] = useState(false);
const [sortBy, setSortBy] = useState("default");
const [statusFilter, setStatusFilter] = useState("All");
const [countryFilter, setCountryFilter] = useState("All");
const [currentPage, setCurrentPage] = useState(1);

const vendorsPerPage = 5;

  const [formData, setFormData] = useState({
  vendorName: "",
  vendorCode: "",
  gstNumber: "",
  panNumber: "",
  email: "",
  phone: "",
  country: "",
  status: "Active",
});

  const fetchVendors = async () => {
    try {
      const response = await api.get("/vendors");
      setVendors(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const createVendor = async () => {

  const result = vendorSchema.safeParse(formData);

  if (!result.success) {

    result.error.issues.forEach((issue) => {
      toast.error(issue.message);
    });

    return;
  }

  
  try {
    await api.post("/vendors", formData);

toast.success("Vendor created successfully!", {
  duration: 3000,
  style: {
    borderRadius: "12px",
    background: "#16a34a",
    color: "#fff",
  },
});

    setFormData({
      vendorName: "",
      vendorCode: "",
      gstNumber: "",
      panNumber: "",
      email: "",
      phone: "",
      country: "",
      status: "Active",
    });

    fetchVendors();

  } catch (error) {
    console.error(error);
   toast.error("Unable to create vendor!", {
  duration: 3000,
});
  }
};
const updateVendor = async () => {

  const result = vendorSchema.safeParse(formData);

if (!result.success) {

  result.error.issues.forEach((issue) => {
    toast.error(issue.message);
  });

  return;
}
  try {
    await api.put(`/vendors/${editingId}`, formData);

    toast.success("Vendor updated successfully!");

    setEditingId(null);

    setFormData({
      vendorName: "",
      vendorCode: "",
      gstNumber: "",
      panNumber: "",
      email: "",
      phone: "",
      country: "",
      status: "Active",
    });

    fetchVendors();

  } catch (error) {
    console.error(error);

    toast.error("Unable to update vendor.");
  }
};

const deleteVendor = (id: number) => {
  toast((t) => (
    <div className="flex flex-col gap-4">
      <p className="font-medium">
        Are you sure you want to delete this vendor?
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          aria-label="Delete vendor"
          onClick={async () => {
            try {
              await api.delete(`/vendors/${id}`);

              toast.dismiss(t.id);

              toast.success("Vendor deleted successfully!");

              fetchVendors();
            } catch (error) {
              console.error(error);

              toast.dismiss(t.id);

              toast.error("Unable to delete vendor.");
            }
          }}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  ));
};
const editVendor = (vendor: Vendor) => {
  setEditingId(vendor.id);

  setFormData({
    vendorName: vendor.vendorName,
    vendorCode: vendor.vendorCode,
    gstNumber: vendor.gstNumber,
    panNumber: vendor.panNumber,
    email: vendor.email,
    phone: vendor.phone,
    country: vendor.country,
    status: vendor.status,
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const sortedVendors = [...vendors].sort((a, b) => {
  switch (sortBy) {
    case "name-asc":
      return a.vendorName.localeCompare(b.vendorName);

    case "name-desc":
      return b.vendorName.localeCompare(a.vendorName);

    case "country":
      return a.country.localeCompare(b.country);

    case "status":
      return a.status.localeCompare(b.status);

    default:
      return 0;
  }
});

const filteredVendors = sortedVendors.filter((vendor) => {
  const keyword = search.toLowerCase();

  const matchesSearch =
    vendor.vendorName.toLowerCase().includes(keyword) ||
    vendor.vendorCode.toLowerCase().includes(keyword) ||
    vendor.email.toLowerCase().includes(keyword);

  const matchesStatus =
    statusFilter === "All" ||
    vendor.status === statusFilter;

  const matchesCountry =
    countryFilter === "All" ||
    vendor.country === countryFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesCountry
  );
});
const indexOfLastVendor = currentPage * vendorsPerPage;

const indexOfFirstVendor =
  indexOfLastVendor - vendorsPerPage;

const currentVendors =
  filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );

const totalPages = Math.ceil(
  filteredVendors.length / vendorsPerPage
);

const exportCSV = () => {
  if (vendors.length === 0) {
    toast.error("No vendors available to export.");
    return;
  }

  const headers = [
    "Vendor Name",
    "Vendor Code",
    "GST Number",
    "PAN Number",
    "Email",
    "Phone",
    "Country",
    "Status",
  ];

  const rows = vendors.map((vendor) => [
    vendor.vendorName,
    vendor.vendorCode,
    vendor.gstNumber,
    vendor.panNumber,
    vendor.email,
    vendor.phone,
    vendor.country,
    vendor.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "vendors.csv";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  toast.success("Vendors exported successfully!");
};
  useEffect(() => {
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2>Loading Vendors...</h2>
      </div>
    );
  }

  return (
    <>
<div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  {/* Header */}
  <div className="mb-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
      Create Vendor
    </h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Enter vendor information and save it to the system.
    </p>
  </div>

  {/* Form */}
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

    <input
      name="vendorName"
      placeholder="Vendor Name"
      value={formData.vendorName}
      onChange={handleChange}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    />

    <input
      name="vendorCode"
      placeholder="Vendor Code"
      value={formData.vendorCode}
      onChange={handleChange}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    />

    <input
      name="gstNumber"
      placeholder="GST Number"
      value={formData.gstNumber}
      onChange={handleChange}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    />

    <input
      name="panNumber"
      placeholder="PAN Number"
      value={formData.panNumber}
      onChange={handleChange}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    />

    <input
      name="email"
      type="email"
      placeholder="Email Address"
      value={formData.email}
      onChange={handleChange}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    />

    <input
      name="phone"
      placeholder="Phone Number"
      value={formData.phone}
      onChange={handleChange}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    />

    <input
      name="country"
      placeholder="Country"
      value={formData.country}
      onChange={handleChange}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    />

    <select
      name="status"
      value={formData.status}
      onChange={handleChange}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    >
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
      <option value="Awaiting Approval">Awaiting Approval</option>
    </select>

  </div>

  {/* Button */}
  <div className="mt-8 flex justify-end">
    <button
      aria-label="edit vendor"
      onClick={editingId ? updateVendor : createVendor}
      className={`rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ${
        editingId
          ? "bg-amber-500 hover:bg-amber-600"
          : "bg-[#005837] hover:bg-[#00452b]"
      }`}
    >
      {editingId ? "Update Vendor" : "Save Vendor"}
    </button>
  </div>

</div>
<div className="mt-8 mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

  {/* Filters */}
  <div className="flex flex-wrap gap-3">

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    >
      <option value="default">Sort By</option>
      <option value="name-asc">Vendor Name (A-Z)</option>
      <option value="name-desc">Vendor Name (Z-A)</option>
      <option value="country">Country</option>
      <option value="status">Status</option>
    </select>

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    >
      <option>All</option>
      <option>Active</option>
      <option>Inactive</option>
      <option>Awaiting Approval</option>
    </select>

    <select
      value={countryFilter}
      onChange={(e) => setCountryFilter(e.target.value)}
      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    >
      <option>All</option>
      <option>India</option>
      <option>USA</option>
      <option>UK</option>
      <option>Canada</option>
    </select>

  </div>

  {/* Search */}
  <div className="relative w-full lg:w-80">

    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

    <input
    aria-label="Search vendors"
      type="text"

      placeholder="Search vendor..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#005837] focus:ring-2 focus:ring-[#005837]/20"
    />

  </div>

</div>
<button
  onClick={exportCSV}
  aria-label="Export vendors to CSV"
  className="rounded-xl bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-700"
>
  Export CSV
</button>

<div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">

  {/* Header */}
  <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
      Vendor List
    </h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      View and manage all registered vendors.
    </p>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead className="bg-slate-100 dark:bg-slate-800">

        <tr>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
            Vendor
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
            Code
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
            Country
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
            Status
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
            Actions
          </th>

        </tr>

      </thead>

      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">

        {currentVendors
          .filter((vendor) => {
            const keyword = search.toLowerCase();

            const matchesSearch =
              vendor.vendorName.toLowerCase().includes(keyword) ||
              vendor.vendorCode.toLowerCase().includes(keyword) ||
              vendor.email.toLowerCase().includes(keyword);

            const matchesStatus =
              statusFilter === "All" ||
              vendor.status === statusFilter;

            const matchesCountry =
              countryFilter === "All" ||
              vendor.country === countryFilter;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesCountry
            );
          })
          .map((vendor) => (

            <tr
              key={vendor.id}
              className="transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >

              {/* Vendor */}
              <td className="px-6 py-5">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {vendor.vendorName}
                </div>
              </td>

              {/* Code */}
              <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                {vendor.vendorCode}
              </td>

              {/* Country */}
              <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                {vendor.country}
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    vendor.status === "Active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : vendor.status === "Inactive"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}
                >
                  {vendor.status}
                </span>
              </td>

              {/* Email */}
              <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                {vendor.email}
              </td>

              {/* Actions */}
              <td className="px-6 py-5">

                <div className="flex justify-center gap-2">

                  <button
                  arial-label="view vendor"
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setIsViewOpen(true);
                    }}
                    className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => editVendor(vendor)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteVendor(vendor.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

      </tbody>

    </table>

  </div>

</div>

<div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-6 py-5 md:flex-row md:items-center md:justify-between">

  {/* Pagination Info */}
  <p className="text-sm text-slate-600 dark:text-slate-400">
    Showing{" "}
    <span className="font-semibold text-slate-900 dark:text-white">
      {filteredVendors.length === 0 ? 0 : indexOfFirstVendor + 1}
    </span>
    {" - "}
    <span className="font-semibold text-slate-900 dark:text-white">
      {Math.min(indexOfLastVendor, filteredVendors.length)}
    </span>
    {" "}of{" "}
    <span className="font-semibold text-slate-900 dark:text-white">
      {filteredVendors.length}
    </span>{" "}
    vendors
  </p>

  {/* Pagination Buttons */}
  <div className="flex flex-wrap items-center gap-2">

    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
          currentPage === index + 1
            ? "bg-[#005837] text-white shadow-sm"
            : "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next
    </button>

  </div>

</div>
<VendorDetailsModal
  vendor={selectedVendor}
  isOpen={isViewOpen}
  onClose={() => setIsViewOpen(false)}
/>
</>

  );
}