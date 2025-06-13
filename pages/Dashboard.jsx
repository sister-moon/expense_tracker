// rrd imports
import { Link, useLoaderData } from "react-router-dom";

// library imports
import { toast } from "react-toastify";

// components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import CurrencySelector from "../components/CurrencySelector";

//  helper functions
import {
  calculateSpentByBudget,
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  waait,
} from "../helpers";
import {
  Cell,
  Label,
  LabelList,
  Legend,
  Pie,
  PieChart,
  Tooltip,
} from "recharts";
import hsl from "@davidmarkclements/hsl-to-hex";
import { useState } from "react";

// loader
export function dashboardLoader() {
  const userName = fetchData("userName");
  let budgets = fetchData("budgets");
  const expenses = fetchData("expenses");

  if (!budgets || budgets.length === 0) {
    budgets = [
      {
        id: crypto.randomUUID(),
        name: "Продукты",
        amount: 15000,
        createdAt: Date.now(),
        spent: 0,
        color: "0 65% 50%",
      },
      {
        id: crypto.randomUUID(),
        name: "Жильё и коммуналка",
        amount: 7000,
        createdAt: Date.now(),
        spent: 0,
        color: "32 65% 50%",
      },
      {
        id: crypto.randomUUID(),
        name: "Транспорт",
        amount: 3000,
        createdAt: Date.now(),
        spent: 0,
        color: "64 65% 50%",
      },
      {
        id: crypto.randomUUID(),
        name: "Связь и интернет",
        amount: 1000,
        createdAt: Date.now(),
        spent: 0,
        color: "96 65% 50%",
      },
      {
        id: crypto.randomUUID(),
        name: "Здоровье",
        amount: 2000,
        createdAt: Date.now(),
        spent: 0,
        color: "128 65% 50%",
      },
      {
        id: crypto.randomUUID(),
        name: "Одежда",
        amount: 3000,
        createdAt: Date.now(),
        spent: 0,
        color: "160 65% 50%",
      },
      {
        id: crypto.randomUUID(),
        name: "Развлечения",
        amount: 2500,
        createdAt: Date.now(),
        spent: 0,
        color: "192 65% 50%",
      },
      {
        id: crypto.randomUUID(),
        name: "Образование",
        amount: 1500,
        createdAt: Date.now(),
        spent: 0,
        color: "224 65% 50%",
      },
      {
        id: crypto.randomUUID(),
        name: "Сбережения",
        amount: 5000,
        createdAt: Date.now(),
        spent: 0,
        color: "256 65% 50%",
      },
    ];
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }

  let expensesMocks = JSON.parse(localStorage.getItem("expenses")) || [];

  if (expensesMocks.length === 0) {
    expensesMocks = [
      {
        id: crypto.randomUUID(),
        name: "Покупка продуктов в магазине",
        amount: 1200,
        createdAt: new Date("2025-06-10T12:00:00Z").getTime(),
        budgetId: budgets.find((b) => b.name === "Продукты").id,
      },
      {
        id: crypto.randomUUID(),
        name: "Оплата аренды квартиры",
        amount: 7000,
        createdAt: new Date("2025-06-01T08:30:00Z").getTime(),
        budgetId: budgets.find((b) => b.name === "Жильё и коммуналка").id,
      },
      {
        id: crypto.randomUUID(),
        name: "Поездка на такси",
        amount: 500,
        createdAt: new Date("2025-05-22T19:00:00Z").getTime(),
        budgetId: budgets.find((b) => b.name === "Транспорт").id,
      },
      {
        id: crypto.randomUUID(),
        name: "Интернет за июнь",
        amount: 1000,
        createdAt: new Date("2025-06-03T14:00:00Z").getTime(),
        budgetId: budgets.find((b) => b.name === "Связь и интернет").id,
      },
      {
        id: crypto.randomUUID(),
        name: "Визит к врачу",
        amount: 2000,
        createdAt: new Date("2025-04-15T10:00:00Z").getTime(),
        budgetId: budgets.find((b) => b.name === "Здоровье").id,
      },
      {
        id: crypto.randomUUID(),
        name: "Покупка футболки",
        amount: 1500,
        createdAt: new Date("2025-05-10T16:00:00Z").getTime(),
        budgetId: budgets.find((b) => b.name === "Одежда").id,
      },
      {
        id: crypto.randomUUID(),
        name: "Кинотеатр",
        amount: 700,
        createdAt: new Date("2025-06-12T20:00:00Z").getTime(),
        budgetId: budgets.find((b) => b.name === "Развлечения").id,
      },
      {
        id: crypto.randomUUID(),
        name: "Курс по программированию",
        amount: 1500,
        createdAt: new Date("2025-03-25T11:00:00Z").getTime(),
        budgetId: budgets.find((b) => b.name === "Образование").id,
      },
      {
        id: crypto.randomUUID(),
        name: "Перевод на сберегательный счет",
        amount: 5000,
        createdAt: new Date("2025-06-01T09:00:00Z").getTime(),
        budgetId: budgets.find((b) => b.name === "Сбережения").id,
      },
    ];

    localStorage.setItem("expenses", JSON.stringify(expensesMocks));
  }

  return { userName, budgets, expenses };
}

// action
export async function dashboardAction({ request }) {
  await waait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // new user submission
  if (_action === "newUser") {
    try {
      localStorage.setItem("userName", JSON.stringify(values.userName));
      return toast.success(`Добро пожаловать, ${values.userName}!`);
    } catch (e) {
      throw new Error("Возникла какая-то проблема с аккаунтом.");
    }
  }

  if (_action === "editBudget") {
    const budgets = fetchData("budgets") ?? [];
    const updated = budgets.map((b) =>
      b.id === values.budgetId ? { ...b, amount: +values.updatedAmount } : b
    );
    localStorage.setItem("budgets", JSON.stringify(updated));
    return toast.success("Сумма категории обновлена!");
  }

  if (_action === "createBudget") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
        month: currentMonth, // ← добавлено
      });
      return toast.success(`Расходы на ${values.newExpense} добавлены!`);
    } catch (e) {
      console.error("Ошибка при создании транзакции:", e);
      throw new Error("Возникла проблема при создании транзакции.");
    }
  }

  if (_action === "createExpense") {
    console.log("==> Пытаемся создать транзакцию", values);
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      return toast.success(`Расходы на  ${values.newExpense} добавлены!`);
    } catch (e) {
      throw new Error("Возникла проблема при создании транзакции.");
    }
  }

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      return toast.success("Транзакция удалена!");
    } catch (e) {
      throw new Error("Возникла проблема при удалении транзакции.");
    }
  }
}

const Dashboard = () => {
  const { userName, budgets, expenses } = useLoaderData();

  const bgs = Array.isArray(budgets)
    ? budgets.map((obj) =>
        Object.assign({}, obj, { spent: calculateSpentByBudget(obj.id) })
      )
    : [];

  const filteredBgs = bgs.filter((item) => item.spent > 0);

  console.log(bgs);

  const budgetColors = (budget) => {
    const res = budget
      .split("")
      .filter((c) => /[a-zA-Z0-9 ]/.test(c))
      .join("")
      .split(" ")
      .map((str) => parseInt(str, 10));

    return hsl(res[0], res[1], res[2]);
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };

  const [currency, setCurrency] = useState("RUB");

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <CurrencySelector
                    currency={currency}
                    setCurrency={setCurrency}
                  />
                </div>

                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                </div>
                {}
                <h2>Статистика по категориям</h2>

                <div className="flex-sm">
                  {
                    <PieChart width={750} height={750}>
                      <Pie
                        dataKey="spent"
                        data={filteredBgs} // уже отфильтрованные по spent > 0
                        isAnimationActive={true}
                        cx="50%"
                        cy="50%"
                        outerRadius={200}
                        fill="#000"
                        label={renderCustomizedLabel}
                      >
                        {filteredBgs.map((budgetItem) => (
                          <Cell
                            key={budgetItem.id}
                            fill={budgetColors(budgetItem.color)}
                            nameKey={budgetItem.name}
                          />
                        ))}
                        <LabelList
                          dataKey="spent"
                          position="outside"
                          offset={30}
                          labelLine={true}
                          formatter={(value) => `${value.toLocaleString()} ₽`}
                        />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  }
                </div>
                <h2>Категории расходов</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} />
                  ))}
                </div>
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Таблица расходов</h2>
                    <Table
                      expenses={expenses
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 8)}
                    />

                    <Link to="expenses" className="btn btn--dark">
                      Посмотреть все расходы
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Учёт расходов - это секрет финансовой свободы.</p>
                <p>Создайте категорию расходов, чтобы начать!</p>
                <AddBudgetForm />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};
export default Dashboard;
