import React, { useEffect, useState } from "react";
import api from "../../../services/api";

const IncomeList = ({ refresh }) => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    category: "All",
    source: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  // Edit modal state
  const [editingIncome, setEditingIncome] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, [refresh]);

  const fetchIncome = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await api.get("/api/income", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIncome(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to fetch income data.");
    } finally {
      setLoading(false);
    }
  };

  // 🔒 12-hour rule
  const canEditOrDelete = (createdAt) => {
    const now = new Date();
    const createdTime = new Date(createdAt);
    return now - createdTime <= 12 * 60 * 60 * 1000;
  };

  // 🗑️ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await api.delete(`/api/income/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIncome((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ✏️ UPDATE
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await api.put(
        `/api/income/${editingIncome._id}`,
        {
          amount: editingIncome.amount,
          category: editingIncome.category,
          division: editingIncome.division,
          description: editingIncome.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIncome((prev) =>
        prev.map((i) =>
          i._id === editingIncome._id ? editingIncome : i
        )
      );

      setEditingIncome(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // 🔍 Filtering
const filteredIncome = income.filter((inc) => {
  const createdAt = new Date(inc.createdAt);

  const categoryMatch =
    filters.category === "All" || inc.category === filters.category;

  const descriptionMatch =
    !filters.description ||
    inc.description
      ?.toLowerCase()
      .includes(filters.description.toLowerCase());

  const minAmountMatch =
    !filters.minAmount || inc.amount >= Number(filters.minAmount);

  const maxAmountMatch =
    !filters.maxAmount || inc.amount <= Number(filters.maxAmount);

  const startDate = filters.startDate
    ? new Date(filters.startDate + "T00:00:00")
    : null;

  const endDate = filters.endDate
    ? new Date(filters.endDate + "T23:59:59")
    : null;

  const startDateMatch =
    !startDate || createdAt >= startDate;

  const endDateMatch =
    !endDate || createdAt <= endDate;

  return (
    categoryMatch &&
    descriptionMatch &&
    minAmountMatch &&
    maxAmountMatch &&
    startDateMatch &&
    endDateMatch
  );
});


  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mt-6">
      <h2 className="text-xl font-bold mb-4">Income List</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="All">All Categories</option>
          <option value="Salary">Salary</option>
          <option value="Business">Business</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Source"
          className="border p-2 rounded"
          value={filters.source}
          onChange={(e) =>
            setFilters({ ...filters, source: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Min Amount"
          className="border p-2 rounded"
          value={filters.minAmount}
          onChange={(e) =>
            setFilters({ ...filters, minAmount: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Max Amount"
          className="border p-2 rounded"
          value={filters.maxAmount}
          onChange={(e) =>
            setFilters({ ...filters, maxAmount: e.target.value })
          }
        />

        <input
  type="date"
  className="border p-2 rounded"
  value={filters.startDate}
  onChange={(e) =>
    setFilters({ ...filters, startDate: e.target.value })
  }
/>

<input
  type="date"
  className="border p-2 rounded"
  value={filters.endDate}
  onChange={(e) =>
    setFilters({ ...filters, endDate: e.target.value })
  }
/>


        {/* 🔹 Reset Filters */} 
        <button onClick={() => setFilters({ category: "All", source: "", minAmount: "", maxAmount: "", startDate: "", endDate: "", }) } 
        className="border px-4 py-2 rounded mb-4" > Reset Filters </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredIncome.length > 0 ? (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Category</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Division</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Edit</th>
              <th className="border p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncome.map((inc) => {
              const allowed = canEditOrDelete(
                inc.createdAt || inc.date
              );

              return (
                <tr key={inc._id} className="text-center">
                  <td className="border p-2">{inc.category}</td>
                  <td className="border p-2">₹{inc.amount}</td>
                  <td className="border p-2">{inc.division}</td>
                  <td className="border p-2">{inc.description}</td>
                  <td className="border p-2">
                    {new Date(
                      inc.date || inc.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="border p-2">
                    {allowed ? (
                      <button
                        onClick={() => setEditingIncome({ ...inc })}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                    ) : (
                      <span className="text-gray-400">Edit</span>
                    )}
                  </td>

                  <td className="border p-2">
                    {allowed ? (
                      <button
                        onClick={() => handleDelete(inc._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-400">Delete</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No income found</p>
      )}

      {/* EDIT MODAL */}
      {editingIncome && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-3">Edit Income</h3>

            <input
              className="border p-2 w-full mb-2"
              value={editingIncome.amount}
              onChange={(e) =>
                setEditingIncome({
                  ...editingIncome,
                  amount: e.target.value,
                })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              value={editingIncome.category}
              onChange={(e) =>
                setEditingIncome({
                  ...editingIncome,
                  category: e.target.value,
                })
              }
            />

            <textarea
              className="border p-2 w-full mb-2"
              value={editingIncome.description}
              onChange={(e) =>
                setEditingIncome({
                  ...editingIncome,
                  description: e.target.value,
                })
              }
            />

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingIncome(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
