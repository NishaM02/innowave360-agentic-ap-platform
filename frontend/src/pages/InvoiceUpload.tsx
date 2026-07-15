import { useState } from "react";
import {
  CloudUpload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";
import { Button } from "../components/ui/button";

export default function InvoiceUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

 const validateFile = (file: File) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
  ];

  if (!allowedTypes.includes(file.type)) {
    toast.error("Invalid file format", {
  description: "Only PDF, PNG and JPG files are supported.",
});
    return;
  }

  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    toast.error("File too large", {
  description: "Maximum file size is 10 MB.",
});
    return;
  }

  setSelectedFile(file);
  setUploadResponse(null);
  setError("");
};
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    validateFile(file);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (
    e: React.DragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      validateFile(file);
    }
  };

  const handleUpload = async () => {
  if (!selectedFile) {
  toast.warning("No invoice selected", {
    description: "Please choose an invoice before uploading.",
  });
  return;
}

    try {
      setUploading(true);
const response = await api.post("/invoices", {
  fileName: selectedFile.name,
  uploadedAt: new Date(),
  fileSize: selectedFile.size,
});
      
     setUploadResponse(response.data);

toast.success("Invoice uploaded successfully!", {
  description: "Your invoice is ready for AI processing.",
});
      setError("");
    } catch (error: any) {

  if (error.response?.status === 409) {

    toast.error("Duplicate Invoice", {
      description: "This invoice has already been uploaded.",
    });

  } else {

    toast.error("Upload Failed", {
      description: "Something went wrong. Please try again.",
    });

  }

  console.error(error);

} finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

  <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">

    {/* Header */}

    <div className="mb-8">

      <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
        AI Powered
      </span>

      <h1 className="text-3xl md:text-8xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
        Invoice Upload
      </h1>

      <p className="text-base md:text-lg text-base leading-7 text-slate-500 dark:text-slate-400">
        Upload your invoices securely. Our AI automatically extracts invoice
        details and prepares them for approval workflows.
      </p>

    </div>

    {/* Main Card */}

    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:bg-slate-900 shadow-xl">

      {/* Card Header */}

      <div className="border-b border-slate-200 px-8 py-6">

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">

          Upload Invoice

        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

          Drag & Drop or browse files from your computer.

        </p>

      </div>

      {/* Card Body */}

      <div className="space-y-8 p-8">

        {/* Upload Area */}

        <label
          htmlFor="invoice"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
         className={`flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed px-8 py-14 transition-all duration-300

${
  dragging
    ? "border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-slate-800"
    : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
}`}
        >

          <div className="flex h-10 w-15 items-center justify-center rounded-full bg-blue-100">

            <CloudUpload className="h-10 w-10 text-blue-600" />

          </div>

          <h3 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-white">

            {dragging
              ? "Drop your invoice here"
              : "Drag & Drop Invoice"}

          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">

            or click below to browse files

          </p>

          <div className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">

            Browse Files

          </div>

          <p className="mt-5 text-xs tracking-wide text-slate-400">

            PDF • PNG • JPG • Maximum 10 MB

          </p>

          <input
            id="invoice"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />

        </label>
                {/* Selected File */}

        {selectedFile && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 p-5">

            <div className="flex flex-col gap-5 flex-col md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-100">

                  <FileText className="h-7 w-7 text-red-500" />

                </div>

                <div>

                  <h3 className="max-w-lg break-all text-lg font-semibold text-slate-900 dark:text-white">
                    {selectedFile.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <p className="text-xs text-slate-400">
                    Selected • {new Date().toLocaleString()}
                  </p>

                </div>

              </div>

              <span className="self-start rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700 md:self-center">
                Ready to Upload
              </span>

            </div>

          </div>
        )}

        {/* Error */}

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

            <AlertCircle className="h-5 w-5 text-red-600" />

            <div>

              <h4 className="text-sm font-semibold text-red-700">
                Upload Error
              </h4>

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* Upload Button */}

       <Button
  onClick={handleUpload}
  disabled={!selectedFile || uploading || uploadResponse}
  className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
>
  {uploading ? (
    <div className="flex items-center gap-3">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      Uploading...
    </div>
  ) : uploadResponse ? (
    <div className="flex items-center gap-3">
      <Upload className="h-4 w-4" />
      Uploaded ✓
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Upload className="h-4 w-4" />
      Upload Invoice
    </div>
  )}
</Button>


        {/* Info Cards */}

        <div className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-5">

            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              📄 Supported Files
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              PDF, PNG and JPG formats up to 10 MB.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-5">

            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              🤖 AI Processing
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              AI automatically extracts invoice details after upload.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">

            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              🔒 Secure Storage
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Files are securely stored for future processing.
            </p>

          </div>

        </div>
                {/* Success Card */}

        {uploadResponse && (
          <div className="rounded-3xl border border-emerald-200 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 shadow-lg">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500">

                <CheckCircle2 className="h-7 w-7 text-white" />

              </div>

              <div className="flex-1">

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Invoice Uploaded Successfully
                </h2>

                <p className="mt-1 text-sm text-slate-50 dark:text-slate-400">
                  Your invoice has been uploaded successfully and is now ready
                  for AI processing.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Invoice ID
                </p>

                <h3 className="mt-2 break-all text-lg font-bold text-slate-900 dark:text-white">
                  {uploadResponse.invoiceId}
                </h3>

              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </p>

                <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {uploadResponse.status}
                </span>

              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Uploaded
                </p>

                <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                  {new Date().toLocaleString()}
                </h3>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>

    {/* Footer */}

    <div className="mt-10 text-center">

      <p className="text-sm text-slate-400 dark:text-slate-500">
        Agentic AP Platform • AI Powered Invoice Processing
      </p>

    </div>

  </div>

</div>

  );
}