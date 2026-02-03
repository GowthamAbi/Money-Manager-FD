import React, { useState } from 'react';
import api from '../../../services/api';

const RecurringExpenseForm = ({ onAddExpense }) => {
    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [nextDue, setNextDue] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Basic validation
        if (!expenseName.trim()) {
            setError('Expense name is required.');
            return;
        }
        if (!amount || amount <= 0) {
            setError('Amount must be a positive number.');
            return;
        }
        if (!category || category === 'Select') {
            setError('Please select a valid category.');
            return;
        }
        if (!nextDue) {
            setError('Next due date is required.');
            return;
        }
    
        setError(''); // Clear errors
    
        const newExpense = {
            expenseName,
            amount: parseFloat(amount),
            category,
            nextDue: new Date(nextDue).toISOString(), // Convert date to ISO format
        };
    
        try {
            // ✅ Use Axios for API call
            const response = await api.post("/api/expenses/recurring", newExpense);
            
            if (response.status === 201 || response.status === 200) {
                alert("RecurringExpense recorded successfully!");
                console.log("Expense added successfully:", response.data);
    
                // ✅ Update parent component
                if (typeof onAddExpense === "function") {
                    onAddExpense(response.data);
                }
    
                // ✅ Reset form fields
                setExpenseName('');
                setAmount('');
                setCategory('');
                setNextDue('');
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            setError(error.response?.data?.message || "Failed to add expense. Try again later.");
        }
    };
    
    
    

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md bg-white">
            {error && <p className="text-red-500">{error}</p>}

            <div className="mb-3">
                <label className="block text-gray-700">Expense Name:</label>
                <input
                    type="text"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-3">
                <label className="block text-gray-700">Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                />
            </div>

            <div className="mb-3">
                <label className="block text-gray-700">Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="Select">Select</option>
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Entertainment">Other</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="block text-gray-700">Next Due Date:</label>
                <input
                    type="date"
                    value={nextDue}
                    onChange={(e) => setNextDue(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                Add Expense
            </button>
        </form>
    );
};

export default RecurringExpenseForm;
