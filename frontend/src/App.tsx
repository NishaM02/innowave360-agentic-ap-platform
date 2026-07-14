import { Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import InvoiceUpload from "./pages/InvoiceUpload";
import Invoices from "./pages/Invoices";
import Notifications from "./pages/Notifications";
import Vendors from "./pages/Vendors";
import VendorDashboard from "./pages/VendorDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="invoice-upload" element={<InvoiceUpload />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="vendor-dashboard" element={<VendorDashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;