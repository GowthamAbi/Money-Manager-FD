import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";
import CategorySummary from "../plans/CategorySummary";

const COLORS = ["#4CAF50", "#F44336"];

const Dashboard = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // period filter
  const [period, setPeriod] = useState("monthly");

  // advanced filters
  const [category, setCategory] = useState("all");
  const [division, setDivision] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔐 Auth + fetch data
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchDashboardData(token);
  }, [period]);

  // 🔹 calculate start date
  const getStartDate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (period === "weekly") now.setDate(now.getDate() - 7);
    if (period === "monthly") now.setMonth(now.getMonth() - 1);
    if (period === "yearly") now.setFullYear(now.getFullYear() - 1);

    return now;
  };

  // 🔹 API call
  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      setError("");

      const startDate = getStartDate();

      const [incomeRes, expenseRes] = await Promise.all([
        api.get("/api/income", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const filterByPeriod = (data) =>
        data.filter((item) => {
          if (!item.date) return false;
          const d = new Date(item.date);
          d.setHours(0, 0, 0, 0);
          return d >= startDate;
        });

      setIncomeData(filterByPeriod(incomeRes.data));
      setExpenseData(filterByPeriod(expenseRes.data));
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADVANCED FILTERS (memoized — NO infinite loop)
  const filteredIncome = useMemo(() => {
    return incomeData.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (division !== "all" && item.division !== division) return false;

      const d = new Date(item.date);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;

      return true;
    });
  }, [incomeData, category, division, fromDate, toDate]);

  const filteredExpense = useMemo(() => {
    return expenseData.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (division !== "all" && item.division !== division) return false;

      const d = new Date(item.date);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;

      return true;
    });
  }, [expenseData, category, division, fromDate, toDate]);

  // ✅ DERIVED TOTALS (NO state, NO useEffect)
  const incomeTotal = filteredIncome.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const expenseTotal = filteredExpense.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const balance = incomeTotal - expenseTotal;

  const chartData = [
    { name: "Income", value: incomeTotal },
    { name: "Expense", value: expenseTotal },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-3xl font-bold text-center mb-6">
        Financial Dashboard
      </h2>

      {/* Period Filter */}
      <div className="flex justify-center mb-4">
        <select
          className="border p-2 rounded"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Food">Food</option>
          <option value="Fuel">Fuel</option>
          <option value="Medical">Medical</option>
          <option value="Salary">Salary</option>
        </select>

        <select
          className="border p-2 rounded"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
        >
          <option value="all">All Divisions</option>
          <option value="Office">Office</option>
          <option value="Personal">Personal</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {/* Chart */}
          <div className="bg-gray-100 p-4 rounded mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData} dataKey="value" outerRadius={100} label>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="bg-gray-100 p-6 rounded text-center">
            <p>
              Income:{" "}
              <strong className="text-green-600">₹{incomeTotal}</strong>
            </p>
            <p>
              Expense:{" "}
              <strong className="text-red-600">₹{expenseTotal}</strong>
            </p>
            <p>
              Balance:{" "}
              <strong className="text-blue-600">₹{balance}</strong>
            </p>
          </div>
        </>
      )}

      {/* Category Summary */}
      <CategorySummary
        period={period}
        category={category}
        division={division}
        fromDate={fromDate}
        toDate={toDate}
      />
    </div>
  );
};

export default Dashboard;
