import React, { useState, useEffect } from "react";
import api from "../../../services/api";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  // ✅ Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Fetch Expenses from API
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      let token = localStorage.getItem("authToken");

      if (!token) {
        alert("Session expired. Please log in.");
        window.location.href = "/login"; // Redirect to login
        return;
      }

      const response = await api.get("/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(response.data);
    } catch (err) {
      console.error("❌ Error fetching expenses:", err);
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Expense Deletion
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Session expired. Please log in.");
        window.location.href = "/login";
        return;
      }

      const response = await api.delete(`/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        // ✅ Update UI by filtering out the deleted expense
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== id));
        alert("Expense deleted successfully.");
      }
    } catch (err) {
      console.error("❌ Error deleting expense:", err);
      setError("Failed to delete expense.");
    }
  };

  return (
    <section className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 max-w-4xl">
      <h2 className="text-3xl font-semibold text-center text-gray-700">Expense List</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {loading ? (
        <p className="text-center text-gray-500">Loading expenses...</p>
      ) : expenses.length > 0 ? (
        <table className="min-w-full table-auto text-left border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="border-b">
                <td className="px-4 py-2 border">₹ {expense.amount}</td>
                <td className="px-4 py-2 border">{expense.category}</td>
                <td className="px-4 py-2 border">{expense.description}</td>
                <td className="px-4 py-2 border">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No expenses found</p>
      )}
    </section>
  );
};

export default ExpenseList;
