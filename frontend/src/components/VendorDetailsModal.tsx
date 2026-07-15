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

interface Props {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorDetailsModal({
  vendor,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen || !vendor) return null;

  return (
   <>
  {/* Overlay */}
  <div
    onClick={onClose}
    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
  />

  {/* Modal */}
 {/* Modal */}
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="vendor-modal-title"
  className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
>

    {/* Header */}
    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-6 py-5">

      <div>
        <h2
  id="vendor-modal-title"
  className="text-2xl font-bold text-slate-900 dark:text-white"
>
  Vendor Details
</h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View vendor information
        </p>
      </div>

      <button
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        ✕
      </button>

    </div>

    {/* Body */}
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

      <Info label="Vendor Name" value={vendor.vendorName} />
      <Info label="Vendor Code" value={vendor.vendorCode} />
      <Info label="GST Number" value={vendor.gstNumber} />
      <Info label="PAN Number" value={vendor.panNumber} />
      <Info label="Email" value={vendor.email} />
      <Info label="Phone" value={vendor.phone} />
      <Info label="Country" value={vendor.country} />
      <Info label="Status" value={vendor.status} />

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
</>
  );
}

function Info({
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
    {value || "-"}
  </p>
</div>
  );
}