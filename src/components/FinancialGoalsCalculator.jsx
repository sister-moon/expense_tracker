import React, { useState } from "react";

const FinancialGoalsCalculator = () => {
  const [goalAmount, setGoalAmount] = useState();
  const [monthlySaving, setMonthlySaving] = useState();
  const [interestRate, setInterestRate] = useState();
  const [years, setYears] = useState(null);

  const calculateYearsToGoal = () => {
    const r = interestRate / 100 / 12;
    let months = 0;
    let saved = 0;

    while (saved < goalAmount && months < 1000 * 12) {
      saved = saved * (1 + r) + monthlySaving;
      months++;
    }

    setYears((months / 12).toFixed(1));
  };

  return (
    <div class="form-wrapper">
      <div className="grid-lg">
        <h2>Калькулятор Финансовых Целей</h2>
        <div className="grid-sm">
          <div class="grid-xs">
            <label>Целевая сумма (₽):</label>
            <input
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(Number(e.target.value))}
            />
          </div>

          <div class="grid-xs">
            <label>Ежемесячное сбережение (₽):</label>
            <input
              type="number"
              value={monthlySaving}
              onChange={(e) => setMonthlySaving(Number(e.target.value))}
            />
          </div>

          <div class="grid-xs">
            <label>Годовая процентная ставка (%):</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>

          <button onClick={calculateYearsToGoal} class="btn btn--dark">
            Рассчитать
          </button>

          {years && (
            <div>
              Вы достигнете цели примерно за <strong>{years}</strong> лет.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialGoalsCalculator;
