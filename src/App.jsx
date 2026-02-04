import React, { Suspense, lazy, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/header/Navbar";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/Sidebar";
import NotificationBell from "./components/Navbar/NotificationBell";
import "./index.css";
import ExpenseRecording from "./components/plans/Expense/ExpenseForm";
import ExpenseList from "./components/plans/Expense/ExpenseList";
import IncomeForm from "./components/plans/Income/IncomeForm";
import IncomeList from "./components/plans/Income/IncomeList";
import IncomeReports from "./components/plans/Income/IncomeReports";
import FinancialReports from "./components/plans/Report/FinancialReports";

import AccountSummary from "./components/pages/AccountSummary";
import Add from "./components/plans/HomePage/Add";

const Login = lazy(() => import("./components/pages/Login"));
const Register = lazy(() => import("./components/pages/Register"));
const Home = lazy(() => import("./components/pages/Home"));
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const ExpenseCategorization = lazy(() => import("./components/plans/Expense/ExpenseChart"));
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
  </div>
);

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation(); // Get current page path

  // Hide Sidebar on Home, Login & Register pages
  const shouldShowSidebar = !["/login", "/register", "/"].includes(location.pathname);

  return (
    <div className="flex h-screen">
      {/* Sidebar (Only Visible if Not on Login, Register, or Home) */}
      {shouldShowSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      )}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${shouldShowSidebar ? "ml-64" : "ml-0"}`}>
        {shouldShowSidebar && <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />}

        <div className="flex-1 p-4">
          {shouldShowSidebar && <NotificationBell />}
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account-summary" element={<AccountSummary />} />

              
              {/* Add Routes */}
              <Route path="/home/add" element={<Add/>} />
              <Route path="/expense/list" element={<ExpenseList />} />
              <Route path="/expense/chart" element={<ExpenseCategorization />} />
              
              
              {/* Expense Routes */}
              <Route path="/expense/recording" element={<ExpenseRecording />} />
              <Route path="/expense/list" element={<ExpenseList />} />
              <Route path="/expense/chart" element={<ExpenseCategorization />} />

              {/* Income Routes */}
              <Route path="/income/form" element={<IncomeForm />} />
              <Route path="/income/list" element={<IncomeList />} />
              <Route path="/income/report" element={<IncomeReports />} />

              {/* Reports & Due Bills */}
              <Route path="/financialReports" element={<FinancialReports />} />
            </Routes>
          </Suspense>
        </div>

        {shouldShowSidebar && <Footer />}
      </div>
    </div>
  );
};

export default App;
