import React, { useState, useEffect } from "react";
import api from "../../../services/api";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    category: "All",
    startDate: "",
    endDate: "",
  });

  // Edit modal
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const response = await api.get("/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(response.data || []);
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  //  12-hour rule
  const canEditOrDelete = (createdAt) =>{
        const now = new Date();
    const createdTime = new Date(createdAt);
    return now - createdTime <= 12 * 60 * 60 * 1000;
  }

  //  DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await api.delete(`/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  //  UPDATE
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");

      await api.put(
        `/api/expenses/${editingExpense._id}`,
        {
          amount: editingExpense.amount,
          category: editingExpense.category,
          description: editingExpense.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExpenses((prev) =>
        prev.map((e) =>
          e._id === editingExpense._id ? editingExpense : e
        )
      );

      setEditingExpense(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  //  FILTERING (DATE RANGE FIXED)
  const filteredExpenses = expenses.filter((exp) => {
    const categoryMatch =
      filters.category === "All" ||
      exp.category === filters.category;

    const createdAt = new Date(exp.createdAt);

    const startDate = filters.startDate
      ? new Date(filters.startDate + "T00:00:00")
      : null;

    const endDate = filters.endDate
      ? new Date(filters.endDate + "T23:59:59")
      : null;

    const startMatch = !startDate || createdAt >= startDate;
    const endMatch = !endDate || createdAt <= endDate;

    return categoryMatch && startMatch && endMatch;
  });

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">
        Expense List
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <select
          className="border p-2"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="All">All</option>
          <option value="Groceries">Groceries</option>
          <option value="Rent">Rent</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          className="border p-2"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />
      </div>

      <button
        onClick={() =>
          setFilters({ category: "All", startDate: "", endDate: "" })
        }
        className="border px-4 py-1 mb-4"
      >
        Reset Filters
      </button>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filteredExpenses.length ? (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Edit</th>
              <th className="border p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => {
              const allowed = canEditOrDelete(exp.createdAt);

              return (
                <tr key={exp._id} className="text-center">
                  <td className="border p-2">₹{exp.amount}</td>
                  <td className="border p-2">{exp.category}</td>
                  <td className="border p-2">{exp.description}</td>
                  <td className="border p-2">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>

                  <td className="border p-2">
                    {allowed ? (
                      <button
                        onClick={() => setEditingExpense({ ...exp })}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                    ) : (
                      <span className="text-gray-400">Locked</span>
                    )}
                  </td>

                  <td className="border p-2">
                    {allowed ? (
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-400">Locked</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No expenses found</p>
      )}

      {/* EDIT MODAL */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-3">Edit Expense</h3>

            <input
              className="border p-2 w-full mb-2"
              value={editingExpense.amount}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  amount: e.target.value,
                })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              value={editingExpense.category}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  category: e.target.value,
                })
              }
            />

            <textarea
              className="border p-2 w-full mb-2"
              value={editingExpense.description}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  description: e.target.value,
                })
              }
            />

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingExpense(null)}
                className="border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExpenseList;
