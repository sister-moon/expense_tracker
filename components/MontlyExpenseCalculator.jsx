import React, { useState } from "react";

const MonthlyExpenseCalculator = () => {
  const [income, setIncome] = useState(0);
  const [categories, setCategories] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);

  const addExpense = () => {
    if (expenseName && expenseAmount) {
      setCategories([
        ...categories,
        { name: expenseName, amount: parseFloat(expenseAmount) },
      ]);
      setExpenseName("");
      setExpenseAmount("");
    }
  };

  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remainingBudget = income - totalExpenses;
  const dailyBudget = remainingBudget / 30;

  return (
    <div className="form-wrapper">
      <div class="grid-sm">
        <div>
          <h2 className="text-xl font-bold mb-2">
            Калькулятор постоянных расходов
          </h2>
          <div className="grid-xs">
            <label className="block text-sm font-medium">
              Ежемесячный доход:
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="grid-xs">
            <label className="text-lg font-semibold">Добавить расход</label>
            <input
              placeholder="Название"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="mb-2"
            />
            <input
              type="number"
              placeholder="Сумма"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="mb-2"
            />
            <button class="btn btn--dark" onClick={addExpense}>
              Добавить
            </button>
          </div>
          <div className="grid-xs">
            <h3 className="text-lg font-semibold">Расходы</h3>
            {categories.map((cat, index) => (
              <div key={index} className="flex justify-between">
                <span>{cat.name}</span>: <span>{cat.amount} ₽</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p>
              Оставшийся бюджет: <strong>{remainingBudget.toFixed(2)} ₽</strong>
            </p>
            <p>
              Бюджет на день: <strong>{dailyBudget.toFixed(2)} ₽</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpenseCalculator;
