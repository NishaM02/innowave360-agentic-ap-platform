
import api from "../services/api";
import { useEffect, useMemo, useState } from "react";
import  InvoiceDetailsModal  from "../components//InvoiceDetailsModal";

import {
  Search,
  Eye,
  FileText,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Invoice {
  invoiceId: number;
  invoiceNumber: string;
  vendor: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: string;
  confidenceScore: number;
  invoiceAmount: number;
  currency: string;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
const exportInvoicesCSV = () => {
  if (invoices.length === 0) {
    toast.error("No invoices available to export.");
    return;
  }

  const headers = [
    "Invoice Number",
    "Vendor",
    "Status",
    "Amount",
    "Currency",
    "Uploaded At",
  ];

  const rows = invoices.map((invoice) => [
    invoice.invoiceNumber,
    invoice.vendor,
    invoice.status,
    invoice.invoiceAmount,
    invoice.currency,
    invoice.uploadedAt,
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
  link.download = `invoices_${new Date().toISOString().split("T")[0]}.csv`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  toast.success("Invoices exported successfully!");
};
  

  useEffect(() => {
    fetchInvoices();

    const interval = setInterval(() => {
      fetchInvoices();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
     const matchesSearch =
  (invoice.invoiceNumber ?? "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (invoice.fileName ?? "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (invoice.vendor ?? "")
    .toLowerCase()
    .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "--";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      case "Human Review":
        return "bg-orange-100 text-orange-700";

      case "Validation Complete":
        return "bg-cyan-100 text-cyan-700";

      case "Extraction Complete":
        return "bg-indigo-100 text-indigo-700";

      case "PII Masked":
        return "bg-purple-100 text-purple-700";

      case "OCR Complete":
        return "bg-sky-100 text-sky-700";

      case "Processing":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700 dark:text-slate-300";
    }
  };

  const processingCount = invoices.filter(
    (invoice) =>
      invoice.status !== "Uploaded" &&
      invoice.status !== "Approved" &&
      invoice.status !== "Failed"
  ).length;

  const approvedCount = invoices.filter(
    (invoice) => invoice.status === "Approved"
  ).length;

  const failedCount = invoices.filter(
    (invoice) => invoice.status === "Failed"
  ).length;
const sortedInvoices = [...filteredInvoices].sort(
  (a, b) =>
    new Date(b.uploadedAt).getTime() -
    new Date(a.uploadedAt).getTime()
);
  if (loading) {
    return (
      <div className="space-y-6">

        <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200"></div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-3xl bg-slate-200"
            />
          ))}

        </div>

        <div className="h-[500px] animate-pulse rounded-3xl bg-slate-200"></div>

      </div>
    );
  }
    return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}

      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Invoice Processing
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Monitor uploaded invoices and track AI processing in real time.
          </p>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl border border-slate-200 bg-whitedark:bg-slate-900 p-6 shadow-sm">

         <div className="mb-3 flex items-center justify-between">
  <p className="text-sm text-slate-500 dark:text-slate-400">Total Invoices</p>
  <FileText className="h-6 w-6 text-blue-600" />
</div>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {invoices.length}
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  <div className="mb-3 flex items-center justify-between">
    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
      Processing
    </p>
    <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-2">
      <Clock3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
    </div>
  </div>

  <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
    {processingCount}
  </h2>

</div>

       <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  <div className="mb-3 flex items-center justify-between">
    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
      Approved
    </p>
    <div className="rounded-xl bg-green-100 dark:bg-green-900/30 p-2">
      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
    </div>
  </div>

  <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
    {approvedCount}
  </h2>

</div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  <div className="mb-3 flex items-center justify-between">
    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
      Failed
    </p>
    <div className="rounded-xl bg-red-100 dark:bg-red-900/30 p-2">
      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
    </div>
  </div>

  <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
    {failedCount}
  </h2>

</div>
      </div>

      {/* Search & Filter */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <input
          type="text"
          placeholder="Search invoice number, vendor or file..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:max-w-md"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white  dark:bg-slate-900 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option>All</option>
          <option>Uploaded</option>
          <option>Processing</option>
          <option>OCR Complete</option>
          <option>PII Masked</option>
          <option>Extraction Complete</option>
          <option>Validation Complete</option>
          <option>Human Review</option>
          <option>Approved</option>
          <option>Failed</option>
        </select>

      </div>
      <button
  onClick={exportInvoicesCSV}
  className="rounded-xl bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-700"
>
  Export CSV
</button>

      {/* Empty State */}

      {filteredInvoices.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-slate-300 bg-white dark:bg-slate-900 py-20 text-center">

          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
            No invoices found
          </h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Try changing your search or filter.
          </p>

        </div>

      ) : (

       <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">

          <div className="overflow-x-auto">

<table className="min-w-full border-separate border-spacing-0">

              <thead className="bg-slate-100 dark:bg-slate-800">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Invoice Number
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Vendor
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Uploaded At
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Confidence
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Currency
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Actions
                  </th>

                </tr>

              </thead>

             <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
              {sortedInvoices.map((invoice) => (
  <tr
  key={invoice.invoiceId}
  className="group border-b border-slate-200 dark:border-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
>
    {/* Invoice Number */}

    <td className="px-6 py-5">

      <div className="font-semibold text-slate-900 dark:text-white">
        {invoice.invoiceNumber}
      </div>

      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {invoice.fileName}
      </div>

      <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {formatFileSize(invoice.fileSize)}
      </div>

    </td>

    {/* Vendor */}

    <td className="px-6 py-5">

      <div className="font-medium text-slate-700 dark:text-slate-300">
        {invoice.vendor}
      </div>

    </td>

    {/* Uploaded At */}

    <td className="px-6 py-5">

      <div className="text-sm text-slate-700 dark:text-slate-300">
        {new Date(invoice.uploadedAt).toLocaleDateString()}
      </div>

      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {new Date(invoice.uploadedAt).toLocaleTimeString()}
      </div>

    </td>

    {/* Status */}

    <td className="px-6 py-5">

      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
          invoice.status
        )}`}
      >

        {invoice.status !== "Approved" &&
          invoice.status !== "Failed" && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-current"></span>
        )}

        {invoice.status}

      </span>

    </td>

    {/* Confidence */}

    <td className="px-6 py-5">

      <div className="flex items-center gap-3">

        <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500">

          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${invoice.confidenceScore}%`,
            }}
          />

        </div>

        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {invoice.confidenceScore || 0}%
        </span>

      </div>

    </td>

    {/* Amount */}

    <td className="px-6 py-5 text-right">

      <span className="font-semibold text-slate-700 dark:text-slate-300">

        ₹ {invoice.invoiceAmount.toLocaleString()}

      </span>

    </td>

    {/* Currency */}

    <td className="px-6 py-5 text-center">

      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">

        {invoice.currency}

      </span>

    </td>

    {/* Actions */}

    <td className="px-6 py-5 text-center">
<button
  onClick={() => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  }}
  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600"
>
  <Eye className="h-4 w-4" />
  View
</button>

    </td>

  </tr>
))}
              </tbody>

            </table>

          </div>

          {/* Footer */}

          <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-6 py-4 md:flex-row md:items-center md:justify-between">

            {/* Auto Refresh */}

            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500"></span>

              <span className="text-sm text-slate-600 dark:text-slate-400">

                Live updates every 3 seconds

              </span>

            </div>

            {/* Total */}

            <div className="text-sm text-slate-600">

              Showing

              <span className="mx-1 font-semibold text-slate-900 dark:text-white ">
                {filteredInvoices.length}
              </span>

              of

              <span className="mx-1 font-semibold text-slate-900 dark:text-white">
                {invoices.length}
              </span>

              invoices

            </div>

          </div>
          <InvoiceDetailsModal
  invoice={selectedInvoice}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>

        </div>

      )}

    </div>
  );
}