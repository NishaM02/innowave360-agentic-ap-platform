import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex flex-1 flex-col lg:ml-72">

        {/* Topbar */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="mt-20 flex-1 overflow-y-auto bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 md:px-6 lg:px-8">

          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  );
}