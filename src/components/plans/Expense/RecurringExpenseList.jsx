import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

const RecurringExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get("/api/expenses/recurring"); 
                setExpenses(response.data); // ✅ Use response.data directly
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch expenses.");
            }
        };
    
        fetchExpenses();
    }, []);
    
    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/expenses/recurring/${id}`); // ✅ No need for `response.ok`
            
            setExpenses(expenses.filter(expense => expense._id !== id)); // ✅ Update state
        } catch (error) {
            setError(error.response?.data?.message || "Failed to delete expense.");
        }
    };
    return (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
            {error && <p className="text-red-500">{error}</p>}

            <h2 className="text-xl font-bold mb-3">Recurring Expenses</h2>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Expense Name</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border">Next Due</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center p-3">No expenses found.</td>
                        </tr>
                    ) : (
                        expenses.map((expense) => (
                            <tr key={expense._id} className="border-t">
                                <td className="p-2 border">{expense.expenseName}</td>
                                <td className="p-2 border">${expense.amount.toFixed(2)}</td>
                                <td className="p-2 border">{expense.category}</td>
                                <td className="p-2 border">{new Date(expense.nextDue).toLocaleDateString()}</td>
                                <td className="p-2 border">
                                    <button 
                                        onClick={() => handleDelete(expense._id)} 
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RecurringExpenseList;
