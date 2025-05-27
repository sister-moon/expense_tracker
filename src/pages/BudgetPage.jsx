// rrd imports
import { useLoaderData } from "react-router-dom";

// library
import { toast } from "react-toastify";

// components
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

// helpers
import {
  createExpense,
  deleteItem,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helpers";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import hsl from "@davidmarkclements/hsl-to-hex";

// loader
export async function budgetLoader({ params }) {
  const budget = await getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: params.id,
  })[0];

  const expenses = await getAllMatchingItems({
    category: "expenses",
    key: "budgetId",
    value: params.id,
  });

  if (!budget) {
    throw new Error("Категорию, которую вы пытаетесь найти, не существует!");
  }

  return { budget, expenses };
}

// action
export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "createExpense") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      return toast.success(`Расходы на ${values.newExpense} добавлены!`);
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
      throw new Error("Возникла проблема при создании транзакции.");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();

  const budgetColors = budget.color
    .split("")
    .filter((c) => /[a-zA-Z0-9 ]/.test(c))
    .join("")
    .split(" ")
    .map((str) => parseInt(str, 10));

  const exps = expenses.map((obj, id) =>
    Object.assign({}, obj, {
      createdAt: formatDateToLocaleString(obj.createdAt),
    })
  );

  return (
    <div
      className="grid-lg"
      style={{
        "--accent": budget.color,
      }}
    >
      <h1 className="h2">
        Категория <span className="accent">{budget.name}</span>
      </h1>
      <div className="flex-lg">
        <BudgetItem budget={budget} showDelete={true} />
        <AddExpenseForm budgets={[budget]} />
        <div className="flex-sm">
          <BarChart
            width={1200}
            height={250}
            data={exps}
            margin={{ top: 20, right: 20, bottom: 20, left: 100 }}
          >
            <XAxis dataKey="createdAt" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="amount"
              fill={hsl(budgetColors[0], budgetColors[1], budgetColors[2])}
            />
          </BarChart>
        </div>
      </div>
      {expenses && expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.name}</span> Расходы
          </h2>

          <Table expenses={expenses} showBudget={false} />
        </div>
      )}
    </div>
  );
};
export default BudgetPage;
