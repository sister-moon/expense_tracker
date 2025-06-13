// rrd imports
import { useLoaderData } from "react-router-dom";

// library import
import { toast } from "react-toastify";

// component imports
import Table from "../components/Table";

// helpers
import { deleteItem, fetchData } from "../helpers";

// loader
export async function expensesLoader() {
  const expenses = fetchData("expenses");
  return { expenses };
}

// action
export async function expensesAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      return toast.success("Транзакция удалена!");
    } catch (e) {
      throw new Error("Возникла какая-то проблема.");
    }
  }
}

const ExpensesPage = () => {
  const { expenses } = useLoaderData();

  return (
    <div className="grid-lg">
      <h1>Все расходы</h1>
      {expenses && expenses.length > 0 ? (
        <div className="grid-md">
          <h2>
            Недавние расходы <small>(Всего {expenses.length} транзакций)</small>
          </h2>
          <Table expenses={expenses} />
        </div>
      ) : (
        <p>Нет расходов</p>
      )}
    </div>
  );
};

export default ExpensesPage;
