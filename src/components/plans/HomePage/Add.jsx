import React, { useState } from "react";
import ExpenseForm from "../Expense/ExpenseForm";
import IncomeForm from "../Income/IncomeForm";

export default function Add() {
  const [modalType, setModalType] = useState(null);

  return (
    <>
      <div className="h-screen flex justify-center items-center gap-8 font-serif font-bold text-xl">
        <button
          onClick={() => setModalType("income")}
          className="bg-green-500 px-6 py-4 cursor-pointer hover:bg-green-700 rounded text-white"
        >
          Income
        </button>

        <button
          onClick={() => setModalType("expense")}
          className="bg-red-500 px-6 py-4 cursor-pointer hover:bg-red-700 rounded text-white"
        >
          Expense
        </button>
      </div>

      {modalType && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center pt-8"
          onClick={() => setModalType(null)}
        >
          <div
            className="bg-white p-6 rounded-lg w-[450px]"
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === "expense" && <ExpenseForm />}

            {modalType === "income" && < IncomeForm/>}

            <button
              className="mt-4 w-full border py-2"
              onClick={() => setModalType(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
