import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import api from "../../services/api";

const COLORS = ["#4CAF50", "#F44336", "#2196F3", "#FF9800"];

const Dashboard = () => {
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("⚠️ No token found. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    fetchDashboardData(token);
  }, []);

  // ✅ Fetch Dashboard Data from Backend
  const fetchDashboardData = async (token) => {
    try {
      const responses = await Promise.all([
        api.get("/api/income", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/api/expenses", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const incomeData = responses[0].data.reduce((acc, curr) => acc + curr.amount, 0);
      const expenseData = responses[1].data.reduce((acc, curr) => acc + curr.amount, 0);


      setTotals({ income: incomeData, expense: expenseData,});
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      setError("Error loading dashboard data.");
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Financial Dashboard</h2>

      {error && <p className="text-red-500">❌ {error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart for Financial Breakdown */}
            <div className="p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">Financial Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={financialData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Financial Summary */}
          <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow">
            <h3 className="text-xl font-bold">Financial Summary</h3>
            {totals && (
              <>
                <p className="text-gray-700">
                  Income: <strong className="text-green-600">₹{totals.income}</strong>
                </p>
                <p className="text-gray-700">
                  Expense: <strong className="text-red-600">₹{totals.expense}</strong>
                </p>

              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
