import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
];

interface DashboardStats {
  totalInvoices: number;
  processing: number;
  humanReview: number;
  approved: number;
  failed: number;

  averageProcessingTime: string;

  statusDistribution: {
    name: string;
    value: number;
  }[];

  invoicesPerDay: {
    date: string;
    count: number;
  }[];

  vendorWiseCount: {
    vendor: string;
    count: number;
  }[];
}
export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
  totalInvoices: 0,
  processing: 0,
  humanReview: 0,
  approved: 0,
  failed: 0,
  statusDistribution: [],
  invoicesPerDay: [],
  vendorWiseCount: [],
  averageProcessingTime: "",
});

  const [loading, setLoading] = useState(true);

const fetchDashboard = async () => {
  const loadingToast = toast.loading("Refreshing dashboard...");

  try {
    const response = await api.get("/dashboard/stats");

    setStats(response.data);

    toast.dismiss(loadingToast);
    toast.success("Dashboard refreshed successfully!");
  } catch (error) {
    console.error(error);

    toast.dismiss(loadingToast);
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
      <div className="p-8">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

 return (
  <div className="p-8">

    <div className="mb-8 flex items-center justify-between">

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Invoice Dashboard
      </h1>

     <button
  onClick={fetchDashboard}
  aria-label="Refresh Dashboard"
  className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
>
  Refresh Dashboard
</button>
    </div>

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

      {/* Total */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white  dark:bg-slate-900 p-6 shadow-sm">

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Total Invoices
        </p>

        <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
          {stats.totalInvoices}
        </h2>

      </div>

      {/* Processing */}
     <div className="rounded-2xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-slate-800 p-6 shadow-sm">

  <p className="text-sm text-blue-700 dark:text-blue-300">
    Processing
  </p>

  <h2 className="mt-3 text-4xl font-bold text-blue-700 dark:text-blue-300">
    {stats.processing}
  </h2>

</div>

      {/* Human Review */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-slate-800 p-6 shadow-sm">

  <p className="text-sm text-amber-700 dark:text-amber-300">
    Human Review
  </p>

  <h2 className="mt-3 text-4xl font-bold text-amber-700 dark:text-amber-300">
    {stats.humanReview}
  </h2>

</div>

      {/* Approved */}
     <div className="rounded-2xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-slate-800 p-6 shadow-sm">

  <p className="text-sm text-green-700 dark:text-green-300">
    Approved
  </p>

  <h2 className="mt-3 text-4xl font-bold text-green-700 dark:text-green-300">
    {stats.approved}
  </h2>

</div>

      {/* Failed */}
    <div className="rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-slate-800 p-6 shadow-sm">

  <p className="text-sm text-red-700 dark:text-red-300">
    Failed
  </p>

  <h2 className="mt-3 text-4xl font-bold text-red-700 dark:text-red-300">
    {stats.failed}
  </h2>

</div>

    </div>
    <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
    Invoice Status Distribution
  </h2>

  <div className="h-96">

    <ResponsiveContainer width="100%" height="100%">

      <PieChart>

        <Pie
          data={stats.statusDistribution}
          dataKey="value"
          nameKey="name"
          outerRadius={130}
          label
        >
          {stats.statusDistribution.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

       <Tooltip
  cursor={{ fill: "transparent" }}
/>

        <Legend />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>
<div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
    Invoices Per Day
  </h2>

  <div className="h-96">

    <ResponsiveContainer width="100%" height="100%">

<BarChart
  data={stats.invoicesPerDay}
  barCategoryGap="40%"
>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis />

       <Tooltip
  cursor={{ fill: "transparent" }}
/>

        <Legend />

        <Bar
          dataKey="count"
          name="Invoices"
          fill="#3b82f6"
          radius={[8, 8, 0, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>


</div>
<div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
    Vendor-wise Invoice Count
  </h2>

  <div className="h-96">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart
  data={stats.vendorWiseCount}
  layout="vertical"
  margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
>
  <CartesianGrid strokeDasharray="3 3" />

  <XAxis type="number" />

  <YAxis
    dataKey="vendor"
    type="category"
    width={170}
  />

  <Tooltip
  cursor={{ fill: "transparent" }}
/>

  <Legend />

  <Bar
    dataKey="count"
    name="Invoices"
    fill="#10b981"
    radius={[0, 8, 8, 0]}
  />
</BarChart>

    </ResponsiveContainer>

  </div>

</div>
<div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">

  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
    Average Processing Time
  </h2>

  <div className="mt-6 flex items-center justify-between">

    <div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Average time taken to process an invoice
      </p>

      <h1 className="mt-3 text-5xl font-bold text-blue-600 dark:text-blue-300">
        {stats.averageProcessingTime}
      </h1>

    </div>

    <div className="rounded-full bg-blue-100 p-5">
      ⏱️
    </div>

  </div>

</div>
  </div>
);
}