import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../../../services/api";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const FinancialReports = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [expenseRes, budgetRes, incomeRes] = await Promise.all([
        api.get("/api/expenses", { headers }),
        api.get("/api/income", { headers }),
      ]);

      setExpenses(Array.isArray(expenseRes.data) ? expenseRes.data : []);
      setIncome(Array.isArray(incomeRes.data) ? incomeRes.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch financial data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Export to CSV
  const exportToCSV = () => {
    const allData = [
      ...expenses.map((e) => ({ Type: "Expense", Category: e.category, Amount: e.amount })),
      ...income.map((i) => ({ Type: "Income", Date: i.date, Amount: i.amount })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Reports");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(dataBlob, "Financial_Reports.xlsx");
  };

  // ✅ Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Reports", 14, 15);

    const allData = [
      ...expenses.map((e) => ["Expense", e.category, e.amount]),
      ...income.map((i) => ["Income", i.date, i.amount]),
    ];

    doc.autoTable({
      head: [["Type", "Category/Date", "Amount"]],
      body: allData,
    });

    doc.save("Financial_Reports.pdf");
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Financial Reports</h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading financial data...</p>
      ) : (
        <>
          {/* Expense Report (Pie Chart) */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Expense Breakdown</h3>
            {expenses.length > 0 ? (
              <Pie
                data={{
                  labels: expenses.map((e) => e.category),
                  datasets: [{ data: expenses.map((e) => e.amount), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }],
                }}
              />
            ) : (
              <p>No expense data available.</p>
            )}
          </div>


          {/* Income Report (Line Chart) */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Income Trend</h3>
            {income.length > 0 ? (
              <Line
                data={{
                  labels: income.map((i) => i.date),
                  datasets: [{ label: "Income", data: income.map((i) => i.amount), borderColor: "rgba(54, 162, 235, 1)", fill: false }],
                }}
              />
            ) : (
              <p>No income data available.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Export to CSV
            </button>

            <button
              onClick={exportToPDF}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Export to PDF
            </button>

            <button
              onClick={fetchData}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Refresh Data
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialReports;
