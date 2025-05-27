// component import
import { useState } from "react";
import ExpenseItem from "./ExpenseItem";
import { formatCurrency } from "../helpers";
import { useCurrency } from "../context/CurrencyContext";

const Table = ({ expenses, showBudget = true }) => {
  const [period, setPeriod] = useState("month");

  const { currency } = useCurrency();

  const getStartDate = () => {
    const date = new Date();

    if (period === "week") {
      date.setDate(date.getDate() - 7);
    } else if (period === "month") {
      date.setMonth(date.getMonth() - 1);
    } else if (period === "year") {
      date.setFullYear(date.getFullYear() - 1);
    }

    // Сбросить время к полуночи
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const startDate = getStartDate();

  const filteredExpenses =
    period === "all"
      ? expenses
      : expenses.filter((expense) => {
          const expenseDate = new Date(expense.createdAt);
          return !isNaN(expenseDate) && expenseDate >= startDate;
        });

  const totalCount = filteredExpenses.length;
  const totalAmount = filteredExpenses
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
    .toFixed(2);
  const avgAmount = totalCount > 0 ? (totalAmount / totalCount).toFixed(2) : 0;

  const amounts = filteredExpenses.map((tx) => Number(tx.amount).toFixed(2));
  const maxAmount = Math.max(...amounts).toFixed(2);
  const minAmount = Math.min(...amounts).toFixed(2);
  const daysWithSpending = new Set(
    filteredExpenses.map((tx) => new Date(tx.date).toDateString())
  ).size;
  const avgPerDay =
    daysWithSpending > 0 ? (totalAmount / daysWithSpending).toFixed(2) : 0;

  const getMonthsCount = (period) => {
    switch (period) {
      case "week":
        return 0.25; // примерно 1/4 месяца
      case "month":
        return 1;
      case "year":
        return 12;
      default:
        return null; // для "all"
    }
  };

  return (
    <div className="table">
      {filteredExpenses.length > 0 && (
        // <div className="analytics">
        //   <strong>Аналитика:</strong>
        //   <p>Общая сумма: {totalAmount} ₽</p>
        //   <p>Средняя сумма: {avgAmount} ₽</p>
        //   <p>Максимальная: {maxAmount} ₽</p>
        //   <p>Минимальная: {minAmount} ₽</p>
        //   <p>Дней с тратами: {daysWithSpending}</p>
        //   <p>Средние траты в день: {avgPerDay} ₽</p>

        //   <div style={{ marginTop: "1rem" }}>
        //     <HistoricalBudget monthsCount={getMonthsCount(period)} />
        //   </div>
        // </div>

        <div class="analytics">
          <div class="analytics-item">
            <span class="value">{formatCurrency(totalAmount, currency)} </span>
            <span class="label">Общая сумма</span>
          </div>
          <div class="analytics-item">
            <span class="value">{avgAmount}</span>
            <span class="label">Средняя сумма</span>
          </div>
          <div class="analytics-item">
            <span class="value">{maxAmount}</span>
            <span class="label">Максимальная</span>
          </div>
          <div class="analytics-item">
            <span class="value">{minAmount}</span>
            <span class="label">Минимальная</span>
          </div>
          <div class="analytics-item">
            <span class="value">{daysWithSpending}</span>
            <span class="label">Дней с тратами</span>
          </div>
          <div class="analytics-item">
            <span class="value">{avgPerDay}</span>
            <span class="label">Средние траты в день</span>
          </div>
        </div>
      )}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Показать за:
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
            <option value="all">Всё время</option>
          </select>
        </label>
      </div>
      {/* <HistoricalBudget /> */}

      <table>
        <thead>
          <tr>
            {[
              "Название",
              "Сумма",
              "Дата",
              showBudget ? "Категория" : "",
              "",
            ].map((i, index) => (
              <th key={index}>{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense.id}>
              <ExpenseItem expense={expense} showBudget={showBudget} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
