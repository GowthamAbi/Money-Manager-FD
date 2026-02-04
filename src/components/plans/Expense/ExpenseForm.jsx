import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const ExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("select");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState([]); // ✅ Added state to store expenses
  const navigate = useNavigate();

  const categories = ["select", "Groceries", "Entertainment", "Utilities", "Rent", "Other"];

  // ✅ Check for authentication token on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Session expired. Please log in.");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch Expenses (Updated List)
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Session expired. Please log in.");
        navigate("/login");
        return;
      }

      const response = await api.get("/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expenses.");
    }
  };

  // ✅ Fetch expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !date || category === "select" || !description) {
      setError("All fields are required");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Session expired. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await api.post(
        "/api/expenses",
        { amount, date, category, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert("Expense recorded successfully!");
        setAmount("");
        setDate("");
        setCategory("select");
        setDescription("");
        setError("");

        // ✅ Update UI with new expense
        setExpenses([...expenses, response.data]);
      }
    } catch (err) {
      console.error("Error recording expense:", err);
      setError(err.response?.data?.message || "Error recording expense");
    }
  };

  return (
    <section className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 ">
      <h2 className="text-3xl font-semibold text-center text-gray-700">Record an Expense</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 overflow-x-auto">
        <div>
          <label className="block text-lg font-medium text-gray-600">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Submit Expense
        </button>
      </form>

      {/* ✅ Display Added Expenses */}
      {expenses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-center">Recent Expenses</h3>
          <ul className="list-disc px-4">
            {expenses.map((exp) => (
              <li key={exp._id} className="text-gray-700">{`${exp.category}: ₹${exp.amount} on ${new Date(exp.date).toLocaleDateString()}`}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default ExpenseForm;
