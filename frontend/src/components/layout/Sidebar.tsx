import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Bell,
  Users,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Invoice Upload",
    path: "/invoice-upload",
    icon: Upload,
  },
  {
    name: "Invoices",
    path: "/invoices",
    icon: FileText,
  },
  
  {
    name: "Vendors",
    path: "/vendors",
    icon: Users,
  },
  {
    name: "Vendor Dashboard",
    path: "/vendor-dashboard",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {


  return (
 <>
    {/* Mobile Overlay */}
    {isOpen && (
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
      />
    )}

    {/* Sidebar */}
    <aside
      className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 transition-transform duration-300
      ${
        isOpen
          ? "translate-x-0"
          : "-translate-x-full"
      }
      lg:translate-x-0 lg:flex lg:flex-col`}
    >

      {/* Logo */}

      <div className="border-b border-slate-200 px-8 py-8">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">

            <Sparkles className="h-6 w-6 text-white" />

          </div>

          <div>

            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Agentic AP
            </h1>

            <p className="text-xs text-slate-900 dark:text-white">
              AI Platform
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-5">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
  key={item.path}
  to={item.path}
  onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />

              <span className="text-sm font-medium">
                {item.name}
              </span>

            </NavLink>
          );
        })}

      </nav>

      {/* Bottom Card */}

     <div className="mx-2 mb-2 mt-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">

  <h3 className="text-sm font-semibold">
    AI Automation
  </h3>

  <p className="mt-1 text-xs leading-5 text-blue-100">
    Upload invoices and let AI extract, validate and process them automatically.
  </p>

</div>

    </aside>
</>
    
  );
}