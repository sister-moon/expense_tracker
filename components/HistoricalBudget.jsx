import React, { useEffect, useState } from "react";

const HistoricalBudget = ({ monthsCount }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categoryAverages, setCategoryAverages] = useState({});

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const savedBudgets = JSON.parse(localStorage.getItem("budgets")) || [];
    setTransactions(savedExpenses);
    setBudgets(savedBudgets);
  }, []);

  useEffect(() => {
    if (transactions.length === 0 || !monthsCount) return;

    const now = Date.now();
    const start = new Date();
    start.setMonth(start.getMonth() - monthsCount);

    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.createdAt);
      return txDate >= start && txDate <= now;
    });

    // Группировка по категориям
    const grouped = {};
    filtered.forEach((tx) => {
      const budgetId = tx.budgetId || "Без категории";
      grouped[budgetId] = grouped[budgetId] || [];
      grouped[budgetId].push(tx);
    });

    const averages = {};
    for (const [budgetId, txs] of Object.entries(grouped)) {
      const total = txs.reduce((sum, tx) => sum + Number(tx.amount), 0);

      // Подсчёт уникальных месяцев с транзакциями
      const uniqueMonths = new Set(
        txs.map((tx) => {
          const date = new Date(tx.createdAt);
          return `${date.getFullYear()}-${date.getMonth()}`;
        })
      );
      const realMonths = Math.max(uniqueMonths.size, 1); // защита от деления на 0

      const avg = (total / realMonths).toFixed(2);

      const budget = budgets.find((b) => b.id === budgetId);
      const label = budget ? budget.name : "Неизвестная категория";
      averages[label] = avg;
    }

    setCategoryAverages(averages);
  }, [transactions, monthsCount, budgets]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Аналитика по категориям:</h3>
      {Object.keys(categoryAverages).length > 0 ? (
        <ul>
          {Object.entries(categoryAverages).map(([category, avg]) => (
            <li key={category}>
              {category}: {avg} ₽ / мес
            </li>
          ))}
        </ul>
      ) : (
        <p>Недостаточно данных для анализа.</p>
      )}
    </div>
  );
};

export default HistoricalBudget;
