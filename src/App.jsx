import { createHashRouter, RouterProvider } from "react-router-dom";

// Library
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import Main, { mainLoader } from "./layouts/Main";

// Actions
import { logoutAction } from "./actions/logout";
import { deleteBudget } from "./actions/deleteBudget";

// Routes
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import Error from "./pages/Error";
import BudgetPage, { budgetAction, budgetLoader } from "./pages/BudgetPage";
import ExpensesPage, {
  expensesAction,
  expensesLoader,
} from "./pages/ExpensesPage";
import CalculatorsPage, { calculatorsLoader } from "./pages/CalculatorsPage";
import FinancialPlans from "./pages/FinancialPlans";
import ReferenceBook, { directLoader } from "./pages/DirectoryPage";

import { CurrentMonthProvider } from "./context/CurrentMonthContext";
import { mockBudgets, mockExpenses } from "./mocks/mockTransactions";
import { useEffect } from "react";

const router = createHashRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
        action: dashboardAction,
        errorElement: <Error />,
      },
      {
        path: "budget/:id",
        element: <BudgetPage />,
        loader: budgetLoader,
        action: budgetAction,
        errorElement: <Error />,
        children: [
          {
            path: "delete",
            action: deleteBudget,
          },
        ],
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
        loader: expensesLoader,
        action: expensesAction,
        errorElement: <Error />,
      },
      {
        path: "calculators",
        element: <CalculatorsPage />,
        loader: calculatorsLoader,
        action: expensesAction,
        errorElement: <Error />,
      },
      {
        path: "plans",
        element: <FinancialPlans />,
        // loader: plansLoader,
        action: expensesAction,
        errorElement: <Error />,
      },
      {
        path: "direct",
        element: <ReferenceBook />,
        loader: directLoader,
        action: expensesAction,
        errorElement: <Error />,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    // Только если есть старые транзакции без месяца
    const raw = localStorage.getItem("expenses");
    if (!raw) return;

    const rawExpenses = JSON.parse(raw);
    const groupedByMonth = {};

    rawExpenses.forEach((tx) => {
      const date = new Date(tx.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = [];
      }
      groupedByMonth[monthKey].push(tx);
    });

    Object.entries(groupedByMonth).forEach(([monthKey, expenses]) => {
      localStorage.setItem(`expenses-${monthKey}`, JSON.stringify(expenses));
    });

    localStorage.removeItem("expenses");
    console.log("Транзакции успешно перераспределены по месяцам.");
  }, []);

  return (
    <div className="App">
      <CurrentMonthProvider>
        <RouterProvider router={router} />
      </CurrentMonthProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
