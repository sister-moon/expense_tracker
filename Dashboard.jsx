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
  const budgets = fetchData("budgets");
  const expenses = fetchData("expenses");

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

  if (_action === "createBudget") {
    try {
      createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
        spent: values.newBudgetSpent,
      });
      return toast.success("Категория создана!");
    } catch (e) {
      throw new Error("Возникла проблема при создании категория.");
    }
  }

  if (_action === "createExpense") {
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
                        data={bgs}
                        isAnimationActive={true}
                        cx="50%"
                        cy="50%"
                        outerRadius={200}
                        fill="#000"
                        label={renderCustomizedLabel}
                      >
                        {budgets.map((budget, index) => (
                          <Cell
                            key={index}
                            fill={budgetColors(budget.color)}
                            nameKey={budget.name}
                          />
                        ))}
                        <LabelList
                          dataKey="spent"
                          position="outside"
                          offset={30}
                          labelLine={true}
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
