import { useState, useEffect } from "react";
import { useCurrency } from "../context/CurrencyContext";
import ExpenseItem from "./ExpenseItem";
import { fetchMonthlyData, formatCurrency } from "../helpers";

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// Получаем список месяцев, в которых есть транзакции
const getAvailableMonths = () => {
  const dataJSON = localStorage.getItem("expenses") || "[]";
  let data = [];
  try {
    data = JSON.parse(dataJSON);
  } catch (e) {
    console.error(
      "Ошибка парсинга списка транзакций для определения месяцев",
      e
    );
  }

  const monthsSet = new Set();
  data.forEach((tx) => {
    if (tx.createdAt) {
      const d = new Date(tx.createdAt);
      if (!isNaN(d)) {
        const month = String(d.getMonth() + 1).padStart(2, "0");
        monthsSet.add(`${d.getFullYear()}-${month}`);
      }
    }
  });

  // Сортируем по убыванию: последние месяцы первыми
  return Array.from(monthsSet).sort((a, b) => (a < b ? 1 : -1));
};

const Table = ({ showBudget = true }) => {
  const { currency } = useCurrency();

  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [expenses, setExpenses] = useState([]);

  // При монтировании компонента собираем доступные месяцы и устанавливаем первый
  useEffect(() => {
    const months = getAvailableMonths();
    setAvailableMonths(months);
    if (months.length > 0) {
      setSelectedMonth(months[0]);
    }
  }, []);

  // При смене месяца — подгружаем соответствующие транзакции
  useEffect(() => {
    if (!selectedMonth) {
      setExpenses([]);
      return;
    }
    const data = fetchMonthlyData("expenses", selectedMonth);
    setExpenses(data);
  }, [selectedMonth]);

  const totalCount = expenses.length;
  const totalAmount = expenses.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const avgAmount = totalCount > 0 ? totalAmount / totalCount : 0;

  const amounts = expenses.map((tx) => Number(tx.amount));
  const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
  const minAmount = amounts.length > 0 ? Math.min(...amounts) : 0;

  const daysWithSpending = new Set(
    expenses.map((tx) => new Date(tx.createdAt).toDateString())
  ).size;
  const avgPerDay = daysWithSpending > 0 ? totalAmount / daysWithSpending : 0;

  return (
    <div className="table">
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Выберите месяц:&nbsp;
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.length === 0 ? (
              <option disabled>Нет транзакций</option>
            ) : (
              availableMonths.map((month) => {
                const [year, mm] = month.split("-");
                const monthIndex = Number(mm) - 1;
                return (
                  <option key={month} value={month}>
                    {monthNames[monthIndex]} {year}
                  </option>
                );
              })
            )}
          </select>
        </label>
      </div>

      {totalCount === 0 ? (
        <p>За выбранный месяц ({selectedMonth}) транзакций нет.</p>
      ) : (
        <>
          <div className="analytics">
            <div className="analytics-item">
              <span className="value">
                {formatCurrency(totalAmount, currency)}
              </span>
              <span className="label">Общая сумма</span>
            </div>
            <div className="analytics-item">
              <span className="value">
                {formatCurrency(avgAmount, currency)}
              </span>
              <span className="label">Средняя сумма</span>
            </div>
            <div className="analytics-item">
              <span className="value">
                {formatCurrency(maxAmount, currency)}
              </span>
              <span className="label">Максимальная</span>
            </div>
            <div className="analytics-item">
              <span className="value">
                {formatCurrency(minAmount, currency)}
              </span>
              <span className="label">Минимальная</span>
            </div>
            <div className="analytics-item">
              <span className="value">{daysWithSpending}</span>
              <span className="label">Дней с тратами</span>
            </div>
            <div className="analytics-item">
              <span className="value">
                {formatCurrency(avgPerDay, currency)}
              </span>
              <span className="label">Средние траты в день</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                {[
                  "Название",
                  "Сумма",
                  "Дата",
                  showBudget ? "Категория" : "",
                  "",
                ].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <ExpenseItem expense={expense} showBudget={showBudget} />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Table;
