import React, { useState } from "react";

const BudgetCalculator = () => {
  const [income, setIncome] = useState(0);
  const [allocation, setAllocation] = useState({
    needs: 50,
    wants: 30,
    savings: 20,
  });

  const expenseCategories = [
    "Нужды",
    "Предпочтения",
    "Сбережения и инвестиции",
  ];

  const handleInputChange = (category, value) => {
    const numericValue = parseInt(value, 10) || 0;
    setAllocation((prev) => ({
      ...prev,
      [category]: numericValue,
    }));
  };

  const needsAmount = (income * allocation.needs) / 100;
  const wantsAmount = (income * allocation.wants) / 100;
  const savingsAmount = (income * allocation.savings) / 100;

  return (
    <div className="form-wrapper">
      <h2>Калькулятор распределения бюджета</h2>
      <div>
        <div className="p-4">
          <label>Ежемесячный доход</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value) || 0)}
            className="mb-4"
          />

          {Object.keys(allocation).map((category, index) => (
            <div key={category} className="mb-4">
              <label>{expenseCategories[index]}</label>
              <input
                type="number"
                value={allocation[category]}
                min={0}
                max={100}
                step={1}
                onChange={(e) => handleInputChange(category, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="p-4">
          <p>Нужды: {needsAmount} ₽</p>
          <p>Предпочтения: {wantsAmount} ₽</p>
          <p>Сбережения и инвестиции: {savingsAmount} ₽</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
