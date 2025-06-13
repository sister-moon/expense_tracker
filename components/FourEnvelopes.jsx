import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { fetchData } from "../helpers";

const FourEnvelopesCalculator = () => {
  const defaultCalcAmount = () => {
    const budgets = fetchData("budgets") || [];
    const defaultAmount = budgets.reduce(
      (sum, b) => sum + Number(b.amount || 0),
      0
    );
    console.log(defaultAmount);
    return defaultAmount;
  };

  useEffect(() => {
    if (income !== 0) {
      calculate();
    }
  }, []);

  const [income, setIncome] = useState(defaultCalcAmount || 0);
  const [envelopes, setEnvelopes] = useState([0, 0, 0, 0]);

  const calculate = () => {
    const amount = parseFloat(income);
    if (isNaN(amount) || amount <= 0) {
      alert("Введите положительное число.");
      return;
    }

    const weekly = (amount / 4).toFixed(2);
    setEnvelopes([weekly, weekly, weekly, (amount - weekly * 3).toFixed(2)]);
  };

  return (
    <div className="form-wrapper">
      <h2>Калькулятор "4 конверта"</h2>
      <label>Введите ежемесячный доход:</label>
      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        placeholder="например, 40000"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button
        onClick={calculate}
        className="btn btn--dark"
        style={{ width: "100%", marginBottom: 16 }}
      >
        Распределить
      </button>

      {envelopes.some((val) => val > 0) && (
        <div>
          <h3>Распределение:</h3>
          <ul>
            {envelopes.map((amount, i) => (
              <li key={i}>
                Неделя {i + 1}: {amount} ₽
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FourEnvelopesCalculator;
