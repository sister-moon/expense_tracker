import { Form, Link, useFetcher } from "react-router-dom";
import {
  BanknotesIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import {
  calculateSpentByBudget,
  formatCurrency,
  formatPercentage,
} from "../helpers";
import { useCurrency } from "../context/CurrencyContext";
import { useState } from "react";

const BudgetItem = ({ budget, showDelete = false }) => {
  const { id, name, amount, color } = budget;
  const spent = calculateSpentByBudget(id);
  const { currency } = useCurrency();

  const [isEditing, setIsEditing] = useState(false);

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="budget" style={{ "--accent": color }}>
      <div className="progress-text">
        <h3>{name}</h3>
        {isEditing ? (
          <fetcher.Form method="post" className="edit-budget-form">
            <input type="hidden" name="_action" value="editBudget" />
            <input type="hidden" name="budgetId" value={id} />
            <input
              type="number"
              name="updatedAmount"
              min={0}
              step={1}
              defaultValue={amount}
              required
              style={{ maxWidth: "120px" }}
            />
            <button type="submit" className="btn" disabled={isSubmitting}>
              Сохранить
            </button>
          </fetcher.Form>
        ) : (
          <p>{formatCurrency(amount, currency)}</p>
        )}
      </div>

      <progress max={amount} value={spent}>
        {formatPercentage(spent / amount)}
      </progress>

      <div className="progress-text">
        <small>{formatCurrency(spent, currency)} Потрачено</small>
        <small>{formatCurrency(amount - spent, currency)} Осталось</small>
      </div>

      <div className="flex-sm">
        <button
          type="button"
          className="btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          <PencilIcon width={20} />
          <span>{isEditing ? "Отмена" : "Изменить сумму"}</span>
        </button>

        {showDelete ? (
          <Form
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (!confirm("Удалить категорию навсегда?")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="btn">
              <span>Удалить категорию</span>
              <TrashIcon width={20} />
            </button>
          </Form>
        ) : (
          <Link to={`/budget/${id}`} className="btn">
            <span>Подробности</span>
            <BanknotesIcon width={20} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BudgetItem;
