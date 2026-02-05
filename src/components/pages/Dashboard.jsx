import React, { useState, useEffect } from "react";
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
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // period filter
  const [period, setPeriod] = useState("monthly"); // weekly | monthly | yearly

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchDashboardData(token);
  }, [period]);

  // 🔹 calculate start date based on period
  const getStartDate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (period === "weekly") {
      now.setDate(now.getDate() - 7);
    } else if (period === "monthly") {
      now.setMonth(now.getMonth() - 1);
    } else if (period === "yearly") {
      now.setFullYear(now.getFullYear() - 1);
    }

    return now;
  };

  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      setError(null);

      const startDate = getStartDate();

      const [incomeRes, expenseRes] = await Promise.all([
        api.get("/api/income", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // ✅ FILTER USING ACTUAL INPUT DATE (NOT createdAt)
      const filteredIncome = incomeRes.data.filter((i) => {
        if (!i.date) return false;
        const d = new Date(i.date);
        d.setHours(0, 0, 0, 0);
        return d >= startDate;
      });

      const filteredExpense = expenseRes.data.filter((e) => {
        if (!e.date) return false;
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d >= startDate;
      });

      const incomeTotal = filteredIncome.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      const expenseTotal = filteredExpense.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      setTotals({
        income: incomeTotal,
        expense: expenseTotal,
        balance: incomeTotal - expenseTotal,
      });
    } catch (err) {
      console.error(err);
      setError("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const financialData = totals
    ? [
        { name: "Income", value: totals.income },
        { name: "Expense", value: totals.expense },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-4">
        Financial Dashboard
      </h2>

      {/* Period Dropdown */}
      <div className="flex justify-center mb-6">
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

      {error && <p className="text-red-500 text-center">{error}</p>}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {/* Chart */}
          <div className="bg-gray-100 p-4 rounded mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {financialData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="bg-gray-100 p-6 rounded">
            <h3 className="text-xl font-bold mb-2">
              Financial Summary ({period})
            </h3>

            <p>
              Income:{" "}
              <strong className="text-green-600">
                ₹{totals.income}
              </strong>
            </p>

            <p>
              Expense:{" "}
              <strong className="text-red-600">
                ₹{totals.expense}
              </strong>
            </p>

            <p>
              Balance:{" "}
              <strong className="text-blue-600">
                ₹{totals.balance}
              </strong>
            </p>
          </div>
        </>
      )}

      {/* Category Summary */}
      <CategorySummary period={period} />
    </div>
  );
};

export default Dashboard;
