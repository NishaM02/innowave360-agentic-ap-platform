import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const STORAGE_KEY = "invoice-settings";

const defaultSettings = {
  name: "Nisha",
  email: "nisha@example.com",
  role: "Software Engineer",

  invoiceUploaded: true,
  ocrCompleted: true,
  humanReview: true,
  invoiceApproved: true,
  vendorCreated: true,

  theme: "Light",

  currency: "INR",
  timezone: "Asia/Kolkata",

  language: "English",
  autoRefresh: "Off",

  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function Settings() {
 const [settings, setSettings] = useState(defaultSettings);
 const{theme,setTheme} = useTheme();

  // -------------------------
  // Load saved settings
  // -------------------------
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);
  

  // -------------------------
  // Apply Theme
  // -------------------------

  
useEffect(() => {
  if (settings.autoRefresh === "Off") return;

  let intervalTime = 0;

  switch (settings.autoRefresh) {
    case "10 Seconds":
      intervalTime = 10000;
      break;
    case "30 Seconds":
      intervalTime = 30000;
      break;
    case "1 Minute":
      intervalTime = 60000;
      break;
    default:
      return;
  }

  const interval = setInterval(() => {
    console.log("Refreshing dashboard...");
    // window.location.reload();
    // fetchInvoices();
  }, intervalTime);

  return () => clearInterval(interval);
}, [settings.autoRefresh]);


  // -------------------------
  // Handle Input Changes
  // -------------------------
 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  console.log(
    "name:",
    e.target.name,
    "value:",
    e.target.value,
    "type:",
    e.target.type
  );

  const { name, value, type } = e.target;

  setSettings((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
  }));
};
  // -------------------------
  // Save Settings
  // -------------------------
const saveSettings = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

  localStorage.setItem(
    "profile",
    JSON.stringify({
      name: settings.name,
      email: settings.email,
      role: settings.role,
    })
  );

  window.dispatchEvent(new Event("profileUpdated"));

  toast.success("Settings saved successfully!");
};
  // -------------------------
  // Reset Settings
  // -------------------------
  const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);

    setSettings(defaultSettings);

    document.documentElement.classList.remove("dark");

    toast.success("Settings reset successfully!");
  };

  // -------------------------
  // Update Password
  // -------------------------
  const updatePassword = () => {
    if (!settings.currentPassword.trim()) {
      toast.error("Current password is required");
      return;
    }

    if (settings.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (settings.newPassword !== settings.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password updated successfully!");

    setSettings((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className="space-y-8 p-8">

  {/* ================= Profile ================= */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

    <h2 className="mb-6 text-xl font-semibold dark:text-white">
      👤 Profile
    </h2>

    <div className="grid gap-6 md:grid-cols-2">

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
          Name
        </label>

        <input
          type="text"
          name="name"
          value={settings.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={settings.email}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
          Role
        </label>

        <input
          type="text"
          name="role"
          value={settings.role}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

    </div>

  </div>



  {/* ================= Notification Preferences ================= */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

    <h2 className="mb-6 text-xl font-semibold dark:text-white">
      🔔 Notification Preferences
    </h2>

    <div className="space-y-5">

      {[
        { key: "invoiceUploaded", label: "Invoice Uploaded" },
        { key: "ocrCompleted", label: "OCR Completed" },
        { key: "humanReview", label: "Human Review" },
        { key: "invoiceApproved", label: "Invoice Approved" },
        { key: "vendorCreated", label: "Vendor Created" },
      ].map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700"
        >

          <span className="font-medium text-slate-700 dark:text-white">
            {item.label}
          </span>

          <label className="relative inline-flex cursor-pointer items-center">

            <input
              type="checkbox"
              name={item.key}
              checked={
                settings[item.key as keyof typeof settings] as boolean
              }
              onChange={handleChange}
              className="peer sr-only"
            />

            <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-600"></div>

            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"></div>

          </label>

        </div>
      ))}

    </div>

  </div>



  {/* ================= Appearance ================= */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

    <h2 className="mb-6 text-xl font-semibold dark:text-white">
      🎨 Appearance
    </h2>

    <div className="space-y-8">

      <div>

        <label className="mb-3 block font-medium text-slate-700 dark:text-white">
          Theme
        </label>

        <div className="flex gap-4">

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 hover:border-blue-500 dark:border-slate-600 dark:text-white">

            <input
  type="radio"
  checked={theme === "Light"}
  onChange={() => setTheme("Light")}
/>

            🌞 Light Mode

          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 hover:border-blue-500 dark:border-slate-600 dark:text-white">

           <input
  type="radio"
  checked={theme === "Dark"}
  onChange={() => setTheme("Dark")}
/>

            🌙 Dark Mode

          </label>

        </div>

      </div>


      {/* Accent Colors */}

      <div>

        <label className="mb-3 block font-medium text-slate-700 dark:text-white">
          Accent Color
        </label>

        <div className="flex gap-4">

          <button
            type="button"
            className="h-10 w-10 rounded-full bg-blue-600 transition hover:scale-110"
          />

          <button
            type="button"
            className="h-10 w-10 rounded-full bg-green-600 transition hover:scale-110"
          />

          <button
            type="button"
            className="h-10 w-10 rounded-full bg-purple-600 transition hover:scale-110"
          />

          <button
            type="button"
            className="h-10 w-10 rounded-full bg-red-600 transition hover:scale-110"
          />

        </div>

      </div>

    </div>

  </div>
  {/* ================= System Settings ================= */}

{/* ================= System Settings ================= */}

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

  <h2 className="mb-6 text-xl font-semibold dark:text-white">
    🌍 System Settings
  </h2>

  <div className="grid gap-6 md:grid-cols-2">

    {/* Currency */}

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
        Default Currency
      </label>

      <select
        name="currency"
        value={settings.currency}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      >
        <option value="INR">🇮🇳 INR</option>
        <option value="USD">🇺🇸 USD</option>
        <option value="EUR">🇪🇺 EUR</option>
        <option value="GBP">🇬🇧 GBP</option>
      </select>
    </div>

    {/* Timezone */}

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
        Timezone
      </label>

      <select
        name="timezone"
        value={settings.timezone}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      >
        <option value="Asia/Kolkata">Asia/Kolkata</option>
        <option value="UTC">UTC</option>
        <option value="America/New_York">America/New_York</option>
        <option value="Europe/London">Europe/London</option>
      </select>
    </div>

    {/* Language */}

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
        Language
      </label>

      <select
        name="language"
        value={settings.language}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      >
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
      </select>
    </div>

    {/* Auto Refresh */}

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
        Auto Refresh
      </label>

      <select
        name="autoRefresh"
        value={settings.autoRefresh}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      >
        <option value="Off">Off</option>
        <option value="10 Seconds">10 Seconds</option>
        <option value="30 Seconds">30 Seconds</option>
        <option value="1 Minute">1 Minute</option>
      </select>
    </div>

  </div>

</div>

{/* ================= Security ================= */}

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

  <h2 className="mb-6 text-xl font-semibold dark:text-white">
    🔐 Security
  </h2>

  <div className="grid gap-6 md:grid-cols-2">

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
        Current Password
      </label>

      <input
        type="password"
        name="currentPassword"
        value={settings.currentPassword}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
        New Password
      </label>

      <input
        type="password"
        name="newPassword"
        value={settings.newPassword}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      />
    </div>

    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
        Confirm Password
      </label>

      <input
        type="password"
        name="confirmPassword"
        value={settings.confirmPassword}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      />
    </div>

  </div>

  <div className="mt-6 flex justify-end">
    <button
      onClick={updatePassword}
      className="rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
    >
      Update Password
    </button>
  </div>

</div>

{/* ================= Save Button ================= */}

<div className="flex justify-end">

  <button
    onClick={saveSettings}
    className="rounded-xl bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
  >
    💾 Save Settings
  </button>

</div>

{/* ================= Danger Zone ================= */}

<div className="rounded-2xl border border-red-300 bg-red-50 p-6 shadow-sm dark:border-red-700 dark:bg-red-950">

  <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
    🚨 Danger Zone
  </h2>

  <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
    Reset all application settings to their default values.
    This action cannot be undone.
  </p>

  <button
    onClick={resetSettings}
    className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
  >
    Reset Settings
  </button>

</div>

</div>
  );
}