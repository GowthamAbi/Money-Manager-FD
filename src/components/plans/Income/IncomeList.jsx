import React, { useEffect, useState } from "react";
import api from "../../../services/api";

const IncomeList = ({ refresh }) => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIncome();
  }, [refresh]); // ✅ Re-fetch income whenever refresh changes

  const fetchIncome = async () => {
    setLoading(true);
    setError("");

    try {
      // ✅ Retrieve token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      const response = await api.get("/api/income", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIncome(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("❌ Error fetching income data:", error);
      setError("Failed to fetch income data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mt-6">
      <h2 className="text-xl font-bold mb-4">Income List</h2>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading income data...</p>
      ) : income.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Source</th>
              <th className="border px-4 py-2">Amount (₹)</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Edit</th>
              <th className="border px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {income.map((inc) => (
              <tr key={inc._id} className="text-center">
                <td className="border px-4 py-2">{inc.source}</td>
                <td className="border px-4 py-2">₹{inc.amount}</td>
                <td className="border px-4 py-2">{new Date(inc.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">Edit</td>
                <td className="border px-4 py-2">Delete</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No income data available.</p>
      )}
    </div>
  );
};

export default IncomeList;
