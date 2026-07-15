import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import {
  RefreshCw,
  BadgeCheck,
  Ban,
} from "lucide-react";
const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

interface DashboardStats {
  totalVendors: number;
  activeVendors: number;
  inactiveVendors: number;
  awaitingApproval: number;

  countryDistribution: {
    name: string;
    value: number;
  }[];

  monthlyVendorCreation: {
    month: string;
    count: number;
  }[];

  topVendors: {
    vendor: string;
    invoiceCount: number;
  }[];
}

export default function VendorDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVendors: 0,
    activeVendors: 0,
    inactiveVendors: 0,
    awaitingApproval: 0,

    countryDistribution: [],
    monthlyVendorCreation: [],
    topVendors: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
  try {
    const response = await api.get("/vendor-dashboard");

    setStats(response.data);

    toast.success("Dashboard refreshed!");
  } catch (error) {
    toast.error("Unable to refresh dashboard.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboard();
  }, []);

if (loading) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="rounded-2xl border border-slate-200 bg-white px-10 py-8 shadow-sm">
        <h2 className="text-xl font-semibold">
          Loading Vendor Dashboard...
        </h2>
      </div>
    </div>
  );
}

  return (
    <>
  
 

<div className="space-y-8 p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">

  {/* Header */}
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Vendor Dashboard
      </h1>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Monitor vendor statistics and approval status.
      </p>
    </div>

    <button
      onClick={() => {
        fetchDashboard();
        toast.success("Vendor dashboard refreshed!");
      }}
      className="inline-flex items-center gap-2 rounded-xl bg-[#005837] px-5 py-2.5 font-medium text-white transition-all duration-200 hover:bg-[#00452b]"
    >
      <RefreshCw className="h-4 w-4" />
      Refresh Dashboard
    </button>

  </div>

  {/* Cards */}
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

    {/* Total Vendors */}
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Total Vendors
        </p>

        <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2">
          <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        {stats.totalVendors}
      </h2>

    </div>

    {/* Active Vendors */}
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Active Vendors
        </p>

        <div className="rounded-xl bg-green-100 dark:bg-green-900/30 p-2">
          <BadgeCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        {stats.activeVendors}
      </h2>

    </div>

    {/* Inactive Vendors */}
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Inactive Vendors
        </p>

        <div className="rounded-xl bg-red-100 dark:bg-red-900/30 p-2">
          <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        {stats.inactiveVendors}
      </h2>

    </div>

    {/* Awaiting Approval */}
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Awaiting Approval
        </p>

        <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-2">
          <Clock3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        {stats.awaitingApproval}
      </h2>

    </div>

  </div>

</div>

<div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  {/* Header */}
  <div className="mb-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
      Vendor Country Distribution
    </h2>

    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Distribution of vendors across different countries.
    </p>
  </div>

  <div className="h-96">

    {stats.countryDistribution.length === 0 ? (

      <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
        No vendor data available.
      </div>

    ) : (

      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Pie
            data={stats.countryDistribution}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60}
            paddingAngle={2}
            label
          >
            {stats.countryDistribution.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
            labelStyle={{ color: "#fff" }}
          />

          <Legend
            wrapperStyle={{
              color: "#64748b",
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    )}

  </div>

</div>


<div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  {/* Header */}
  <div className="mb-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
      Monthly Vendor Creation
    </h2>

    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Number of vendors created each month.
    </p>
  </div>

  <div className="h-96">

    {stats.monthlyVendorCreation.length === 0 ? (

      <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
        No vendor data available.
      </div>

    ) : (

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={stats.monthlyVendorCreation}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#CBD5E1"
            className="dark:stroke-slate-700"
          />

          <XAxis
            dataKey="month"
            tick={{ fill: "#64748B", fontSize: 12 }}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={{ stroke: "#CBD5E1" }}
          />

          <YAxis
            tick={{ fill: "#64748B", fontSize: 12 }}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={{ stroke: "#CBD5E1" }}
          />

          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
            labelStyle={{ color: "#fff" }}
          />

          <Bar
            dataKey="count"
            fill="#005837"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    )}

  </div>

</div>
<div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  {/* Header */}
  <div className="mb-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
      Top Vendors by Invoice Count
    </h2>

    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Vendors with the highest number of processed invoices.
    </p>
  </div>

  <div className="h-96">

    {stats.topVendors.length === 0 ? (

      <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
        No vendor data available.
      </div>

    ) : (

      <ResponsiveContainer width="100%" height="100%">

        <BarChart
          data={stats.topVendors}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 60,
            bottom: 5,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#CBD5E1"
          />

          <XAxis
            type="number"
            tick={{ fill: "#64748B", fontSize: 12 }}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={{ stroke: "#CBD5E1" }}
          />

          <YAxis
            type="category"
            dataKey="vendor"
            tick={{ fill: "#64748B", fontSize: 12 }}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={{ stroke: "#CBD5E1" }}
            width={120}
          />

          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
            labelStyle={{ color: "#fff" }}
          />

          <Legend
            wrapperStyle={{
              color: "#64748b",
            }}
          />

          <Bar
            dataKey="invoiceCount"
            name="Invoices"
            fill="#005837"
            radius={[0, 8, 8, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    )}

  </div>

</div>
</>
  );
}