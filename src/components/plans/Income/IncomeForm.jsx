import React, { useState } from "react";
import api from "../../../services/api";

const IncomeForm = () => {
  const [income, setIncome] = useState({
    amount: "",
    category: "select",
    division: "select",
    description: "",
    date: ""
  });

  const [error, setError] = useState("");

  const categories = [
    "select",
    "Salary",
    "Business",
    "Freelance",
    "Interest",
    "Other"
  ];

  const divisions = ["select", "Office", "Personal"];

  const handleChange = (e) => {
    setIncome({ ...income, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { amount, category, division, description, date } = income;

    if (
      !amount ||
      category === "select" ||
      division === "select" ||
      !description ||
      !date
    ) {
      setError("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const payload = {
        ...income,
        type: "income"
      };

      const response = await api.post("/api/income", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setIncome({
          amount: "",
          category: "select",
          division: "select",
          description: "",
          date: ""
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add income");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Add Income</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          name="amount"
          value={income.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border p-2 w-full"
        />

        <select
          name="category"
          value={income.category}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          name="division"
          value={income.division}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          {divisions.map((div) => (
            <option key={div} value={div}>
              {div}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="description"
          value={income.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full"
        />

        <input
          type="date"
          name="date"
          value={income.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Income
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;
