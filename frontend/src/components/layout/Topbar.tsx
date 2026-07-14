import { Bell, Moon, Search, UserCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header
      style={{
        height: "70px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#f3f4f6",
          padding: "10px 14px",
          borderRadius: "10px",
          width: "350px",
        }}
      >
        <Search size={18} />
        <input
          type="text"
          placeholder="Search invoices, vendors..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
          }}
        />
      </div>

      {/* Right Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Bell size={22} />
        <Moon size={22} />
        <UserCircle size={32} />
      </div>
    </header>
  );
}