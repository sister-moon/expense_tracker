import hsl from "@davidmarkclements/hsl-to-hex";

export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

// colors
const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;

  return `${existingBudgetLength * 32} 65% 50%`;
};

export const generateRandomHexColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;
  return hsl((existingBudgetLength - 1) * 32, 65, 50);
};

// Local storage
// export const fetchData = (key) => {
//   return JSON.parse(localStorage.getItem(key));
// };

export const fetchData = (key) => {
  if (typeof localStorage === "undefined") return null;
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`Ошибка при разборе localStorage["${key}"]:`, e);
    return null;
  }
};

// Get all items from local storage
export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] === value);
};

// delete item from local storage
export const deleteItem = ({ key, id }) => {
  const existingData = fetchData(key);
  if (id) {
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

// create budget
export const createBudget = ({ name, amount, month }) => {
  const item = {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    amount: +amount,
    spent: 0,
    color: generateRandomColor(),
  };
  saveMonthlyItem("budgets", item, month);
};

// create expense
export const createExpense = ({ name, amount, budgetId, month }) => {
  const item = {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    amount: +amount,
    budgetId,
  };

  // Сохраняем по месяцу
  saveMonthlyItem("expenses", item, month);

  // Параллельно сохраняем в общий список (для Dashboard и старых компонентов)
  const existingExpenses = fetchData("expenses") ?? [];
  localStorage.setItem("expenses", JSON.stringify([...existingExpenses, item]));
};

// total spent by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    // check if expense.id === budgetId I passed in
    if (expense.budgetId !== budgetId) return acc;

    // add the current amount to my total
    return (acc += expense.amount);
  }, 0);
  return budgetSpent;
};

// FORMATTING
export const formatDateToLocaleString = (epoch) =>
  Intl.DateTimeFormat("ru", { dateStyle: "short", timeStyle: "short" }).format(
    new Date(epoch)
  );

// Formating percentages
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// Format currency
export const formatCurrency = (amt, currency = "RUB") => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency,
  });
};

export const getStorageKeyForMonth = (key, month) => `${key}-${month}`;

// Получить данные
export function fetchMonthlyData(type, yearMonth) {
  const dataJSON = localStorage.getItem(type);
  if (!dataJSON) return [];

  try {
    const data = JSON.parse(dataJSON);
    if (!Array.isArray(data)) return [];

    const [year, month] = yearMonth.split("-");
    return data.filter((tx) => {
      if (!tx.createdAt) return false;
      const d = new Date(tx.createdAt);
      return (
        d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month)
      );
    });
  } catch (e) {
    console.error("Ошибка парсинга данных из localStorage", e);
    return [];
  }
}

// Сохранить запись
export const saveMonthlyItem = (key, item, month) => {
  const existing = fetchMonthlyData(key, month);
  const updated = [...existing, item];
  localStorage.setItem(
    getStorageKeyForMonth(key, month),
    JSON.stringify(updated)
  );
};
