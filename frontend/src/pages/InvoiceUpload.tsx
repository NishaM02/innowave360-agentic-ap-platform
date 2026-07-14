import { useState } from "react";
import { Upload } from "lucide-react";
import api from "../services/api";

export default function InvoiceUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<any>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, PNG and JPG files are allowed.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setUploadResponse(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an invoice first.");
      return;
    }

    try {
      setUploading(true);

      const response = await api.post("/invoices", {
        fileName: selectedFile.name,
        uploadedAt: new Date(),
      });

      setUploadResponse(response.data);

      alert("Invoice uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "10px" }}>Invoice Upload</h1>

      <p style={{ color: "#64748b", marginBottom: "25px" }}>
        Upload invoices for AI processing.
      </p>

      <div
        style={{
          border: "2px dashed #cbd5e1",
          borderRadius: "15px",
          padding: "50px",
          textAlign: "center",
          background: "#ffffff",
        }}
      >
        <Upload size={60} />

        <h2 style={{ marginTop: "20px" }}>
          Select Invoice
        </h2>

        <p style={{ color: "#64748b" }}>
          Supported: PDF, PNG, JPG
        </p>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          style={{ marginTop: "25px" }}
        />

        {selectedFile && (
          <div style={{ marginTop: "25px" }}>
            <h3>Selected File</h3>

            <p>
              <strong>Filename:</strong> {selectedFile.name}
            </p>

            <p>
              <strong>Uploaded At:</strong>{" "}
              {new Date().toLocaleString()}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            marginTop: "25px",
            padding: "12px 30px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {uploading ? "Uploading..." : "Upload Invoice"}
        </button>

        {uploadResponse && (
          <div
            style={{
              marginTop: "30px",
              background: "#ecfdf5",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h3>Upload Successful</h3>

            <p>
              <strong>Invoice ID:</strong>{" "}
              {uploadResponse.invoiceId}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {uploadResponse.status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}