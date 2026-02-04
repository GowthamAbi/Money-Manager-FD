import React, { useEffect, useState } from "react";
import api from "../../services/api";

const CategorySummary = ({ period }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [period]);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await api.get(
        `/api/category/expense-summary`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(res.data);
    } catch (err) {
      console.error("Failed to load category summary");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading category summary...</p>;

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-xl font-bold mb-3">
        Expense Category Summary
      </h3>

      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Category</th>
              <th className="border p-2">Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="text-center">
                <td className="border p-2">{item._id}</td>
                <td className="border p-2">
                  ₹{item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategorySummary;
