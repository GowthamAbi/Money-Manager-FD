import React, { useState } from "react";
import api from "../../../services/api";

const IncomeForm = ({ onIncomeAdded }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setIncome({ ...income, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!income.source || !income.amount || !income.date) {
      setError("All fields are required.");
      return;
    }

    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required.");
        return;
      }

      // Send API request with token
      const response = await api.post("/api/income", income, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setIncome({ source: "", amount: "", date: "" });
        onIncomeAdded(); // Notify parent to refresh list
      }
    } catch (error) {
      console.error("Error adding income:", error);
      setError("Failed to add income. Try again.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Add Income</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="source"
          value={income.source}
          onChange={handleChange}
          placeholder="Income Source"
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="amount"
          value={income.amount}
          onChange={handleChange}
          placeholder="Amount ($)"
          className="border p-2 w-full"
        />
        <input
          type="date"
          name="date"
          value={income.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Income
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;
