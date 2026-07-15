
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

interface Props {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceDetailsModal({
  invoice,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

  <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">

    {/* Header */}
    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-6 py-5">

      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Invoice Details
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View complete invoice information
        </p>
      </div>

      <button
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        ×
      </button>

    </div>

    {/* Body */}
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

      <DetailItem
        label="Invoice Number"
        value={invoice.invoiceNumber}
      />

      <DetailItem
        label="Vendor"
        value={invoice.vendor}
      />

      <DetailItem
        label="File Name"
        value={invoice.fileName}
      />

      <DetailItem
        label="File Size"
        value={`${(invoice.fileSize / 1024).toFixed(1)} KB`}
      />

      <DetailItem
        label="Uploaded At"
        value={new Date(invoice.uploadedAt).toLocaleString()}
      />

      {/* Status */}
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Status
        </p>

        <span
          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            invoice.status === "Approved"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : invoice.status === "Failed"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          }`}
        >
          {invoice.status}
        </span>
      </div>

      {/* Confidence */}
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Confidence
        </p>

        <div className="mt-3 flex items-center gap-3">

          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

            <div
              className="h-full rounded-full bg-[#005837] transition-all duration-500"
              style={{
                width: `${invoice.confidenceScore}%`,
              }}
            />

          </div>

          <span className="font-semibold text-slate-900 dark:text-white">
            {invoice.confidenceScore}%
          </span>

        </div>

      </div>

      <DetailItem
        label="Invoice Amount"
        value={`₹ ${invoice.invoiceAmount.toLocaleString()}`}
      />

      <DetailItem
        label="Currency"
        value={invoice.currency}
      />

    </div>

    {/* Footer */}
    <div className="flex justify-end border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-6 py-5">

      <button
        onClick={onClose}
        className="rounded-xl bg-[#005837] px-6 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#00452b]"
      >
        Close
      </button>

    </div>

  </div>

</div>
  );
}
function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="break-words text-base font-semibold text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}