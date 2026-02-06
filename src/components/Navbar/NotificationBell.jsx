import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../../services/api";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const notificationRef = useRef();

    //  Fetch financial data from separate APIs
    const fetchFinancialData = useCallback(async () => {
        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                console.warn("⚠️ No token found, user may not be authenticated.");
                return;
            }


            // Fetch Income, Expense, and Budget data
            const [incomeRes, expenseRes, budgetRes] = await Promise.all([
                api.get("/api/income", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/api/expenses", { headers: { Authorization: `Bearer ${token}` } }),
                
            ]);

            checkFinancialStatus(incomeRes.data, expenseRes.data, budgetRes.data);
        } catch (error) {
            console.error("❌ Error fetching financial data:", error.response ? error.response.data : error.message);

            //  Handle unauthorized token (redirect to login)
            if (error.response?.status === 401) {
                localStorage.removeItem("authToken");
                window.location.href = "/login"; 
            }
        }
    }, []);

    //  Runs once when component mounts
    useEffect(() => {
        fetchFinancialData();

        //  Close notifications when clicking outside
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [fetchFinancialData]);

    //  Process financial status and create notifications
    const checkFinancialStatus = (incomeArray, expenseArray, budgetArray) => {
        let totalIncome = 0;
        let totalExpense = 0;
        let totalBudget = 0;

        //  Sum up all income amounts
        if (Array.isArray(incomeArray) && incomeArray.length > 0) {
            totalIncome = incomeArray.reduce((sum, item) => sum + (item.amount || 0), 0);
        }

        //  Sum up all expense amounts
        if (Array.isArray(expenseArray) && expenseArray.length > 0) {
            totalExpense = expenseArray.reduce((sum, item) => sum + (item.amount || 0), 0);
        }

        //  Extract the total budget (assuming a single budget entry)
        if (Array.isArray(budgetArray) && budgetArray.length > 0) {
            totalBudget = budgetArray[0].amount || 0;
        }


        let newNotifications = [];



        if (totalIncome < totalExpense) {
            newNotifications.push("Warning: Your expenses are higher than your income!");
        }
        if (totalExpense > totalBudget) {
            newNotifications.push("Alert: Your expenses exceed your budget!");
        }

        if (totalBudget >= totalIncome&&totalIncome>0) {
            newNotifications.push("Great job! Your budget is well-managed.");
        }
        

        setNotifications(newNotifications);
    };

    // Clear notifications
    const clearNotifications = () => {
        setNotifications([]);
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={notificationRef}>
            {/* Notification Bell Button */}
            <button className="p-2 bg-gray-200 rounded-full relative" onClick={() => setShowDropdown(!showDropdown)}>
                🔔
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/*  Notification Dropdown */}
            {showDropdown && notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 z-50">
                    {notifications.map((note, index) => (
                        <div key={index} className="text-red-600 text-sm p-2 border-b">
                            {note}
                        </div>
                    ))}
                    <button className="mt-2 w-full bg-red-500 text-white p-2 rounded-md" onClick={clearNotifications}>
                        Clear Notifications
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
