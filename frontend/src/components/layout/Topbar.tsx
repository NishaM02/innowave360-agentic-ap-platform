import {
  Bell,
  Search,
  Settings,
  UserCircle,
  Menu,
} from "lucide-react";

import NotificationDrawer from "../../components/NotificationDrawer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";


import api from "../../services/api";
import { ChevronDown, LogOut } from "lucide-react";

interface Notification {
  id: number;
  isRead: boolean;
}
interface TopbarProps {
  onMenuClick: () => void;
}
export default function Topbar({ onMenuClick }: TopbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
  name: "Nisha",
  email: "nisha@example.com",
  role: "Software Engineer",
});
  const [searchTerm, setSearchTerm] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
const [searchResults, setSearchResults] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
 useEffect(() => {
  fetchNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 3000);

  return () => clearInterval(interval);
}, []);


const fetchNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    setNotifications(response.data);
  } catch (error) {
    console.error(error);
  }
};


  const unreadCount = notifications.filter(
  (notification) => !notification.isRead
).length;

const searchData = async (value: string) => {
  setSearchTerm(value);

  if (!value.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    const [invoiceRes, vendorRes] = await Promise.all([
      api.get("/invoices"),
      api.get("/vendors"),
    ]);

    const invoices = invoiceRes.data
      .filter((invoice: any) =>
        invoice.invoiceNumber
          .toLowerCase()
          .includes(value.toLowerCase())
      )
      .map((invoice: any) => ({
        type: "Invoice",
        name: invoice.invoiceNumber,
      }));

    const vendors = vendorRes.data
      .filter((vendor: any) =>
        vendor.vendorName
          .toLowerCase()
          .includes(value.toLowerCase())
      )
      .map((vendor: any) => ({
        type: "Vendor",
        name: vendor.vendorName,
      }));

    setSearchResults([...invoices, ...vendors]);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  const savedProfile = localStorage.getItem("profile");

  if (savedProfile) {
    setProfile(JSON.parse(savedProfile));
  }
}, []);
  return (
    <>
   <header className="fixed top-0 left-0 right-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-4 md:px-6 lg:left-72 lg:px-8">

      {/* Left */}

     {/* Left */}
<div className="flex items-center gap-4">

  {/* Mobile Menu */}
  <button
    onClick={onMenuClick}
    className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
  >
    <Menu className="h-6 w-6 text-slate-700 dark:text-white" />
  </button>

  <div>
    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
      Agentic AP Platform
    </h1>

    <p className="mt-1 hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
      AI Invoice Automation Dashboard
    </p>
  </div>

</div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}
<div className="relative hidden md:block w-52 lg:w-72 xl:w-96">

  {/* Search Box */}
  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">

    <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />

    <input
      type="text"
      placeholder="Search invoices or vendors..."
      value={searchTerm}
      onChange={(e) => searchData(e.target.value)}
      className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
    />

  </div>

  {/* Search Results */}
  {searchTerm && (
    <div className="absolute left-0 top-full z-50 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">

      {searchResults.length > 0 ? (
        searchResults.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer border-b border-slate-100 dark:border-slate-700 px-4 py-3 transition hover:bg-slate-100 dark:hover:bg-slate-800 last:border-b-0"
          >
            <p className="font-semibold text-slate-900 dark:text-white">
              {item.name}
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {item.type}
            </p>
          </div>
        ))
      ) : (
        <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No matching invoices or vendors found.
        </div>
      )}

    </div>
  )}

</div>
        {/* Notification */}
        
<div
  onClick={() => setIsDrawerOpen(true)}
  aria-label="Export vendors to CSV"
  className="relative cursor-pointer rounded-full p-2 transition hover:bg-slate-100"
>
  <Bell size={22} />

  {unreadCount > 0 && (
  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
    {unreadCount}
  </span>
)}
</div>
        {/* Settings */}

       <button
  onClick={() => navigate("/settings")}
  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 transition hover:bg-slate-100 dark:hover:bg-slate-700"
>
  <Settings className="h-5 w-5 text-slate-600 dark:text-slate-300" />
</button>

        {/* User */}

      <div className="relative">

  <button
    onClick={() => setProfileOpen(!profileOpen)}
    className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 shadow-sm transition hover:shadow-md"
  >
    <UserCircle className="h-10 w-10 text-blue-600" />

    <div className="hidden lg:block text-left">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        {profile.name}
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {profile.role}
      </p>
    </div>

    <ChevronDown
      className={`h-4 w-4 text-slate-500 transition-transform ${
        profileOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  {profileOpen && (
    <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">

      <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
    {profile.name}
  </h3>

  <p className="text-xs text-slate-500 dark:text-slate-400">
    {profile.email}
  </p>

  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
    {profile.role}
  </p>
</div>
      

      <button
        onClick={() => toast.success("Logged out successfully")}
        className="flex w-full items-center gap-3 px-5 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>

    </div>
  )}

</div>
      </div>
      

    </header>
    <NotificationDrawer
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    />
  </>
    
  );
}