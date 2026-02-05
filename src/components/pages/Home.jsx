import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 text-white text-center p-6">
      <h1 className="text-5xl font-extrabold mb-4 animate-fadeIn">Welcome to <span className="text-yellow-300">Finance Tracker</span></h1>
      <p className="text-lg text-gray-200 mb-6 max-w-2xl animate-fadeIn delay-200">
        Take control of your finances with our expense tracking, and financial planning tools.
      </p>
      <div className="flex space-x-6 animate-slideUp delay-400">
        <Link to="/login" className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-110 hover:bg-yellow-500">
          Login
        </Link>
        <Link to="/register" className="bg-green-400 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-110 hover:bg-green-500">
          Register
        </Link>
      </div>
      <div className="mt-12 bg-white bg-opacity-20 p-6 rounded-lg shadow-lg backdrop-blur-md w-full max-w-lg">
        <h2 className="text-3xl font-bold text-yellow-300">Features</h2>
        <ul className="mt-4 text-lg text-black space-y-3">
          
          <li className="flex items-center space-x-2"><span>✅</span> <span>Expense Tracking</span></li>
          <li className="flex items-center space-x-2"><span>✅</span> <span>Income Management</span></li>
          <li className="flex items-center space-x-2"><span>✅</span> <span>Financial Reports</span></li>
          
        </ul>
      </div>
    </div>
  );
};

export default Home;
