import React, { useEffect, useState } from "react";
import { fetchData } from "../helpers";

const sixJarRules = [
  { label: "Обязательные расходы", percent: 55 },
  { label: "Финансовая свобода", percent: 10 },
  { label: "Накопления на крупные цели", percent: 10 },
  { label: "Образование", percent: 10 },
  { label: "Развлечения", percent: 10 },
  { label: "Благотворительность", percent: 5 },
];

const SixJarsCalculator = () => {
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
  const [distribution, setDistribution] = useState([]);

  const calculate = () => {
    const amount = parseFloat(income);
    if (isNaN(amount) || amount <= 0) {
      alert("Введите корректный доход.");
      return;
    }

    const result = sixJarRules.map((jar) => ({
      ...jar,
      value: ((amount * jar.percent) / 100).toFixed(2),
    }));

    setDistribution(result);
  };

  return (
    <div className="form-wrapper">
      <h2>Калькулятор по методу "6 кувшинов"</h2>
      <label>Введите сумму дохода:</label>
      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        placeholder="например, 50000"
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button
        onClick={calculate}
        style={{ width: "100%", marginBottom: 16 }}
        className="btn btn--dark"
      >
        Распределить
      </button>

      {distribution.length > 0 && (
        <div>
          <h3>Распределение:</h3>
          <ul>
            {distribution.map((jar, idx) => (
              <li key={idx}>
                <strong>{jar.label}</strong>: {jar.value} ₽ ({jar.percent}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SixJarsCalculator;
