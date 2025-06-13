import { useEffect, useState, useRef } from "react";
import useLocalStorageState from "../hooks/useLocalStorageState";

const FlexibleCalculator = () => {
  const methods = ["4 конверта", "6 кувшинов"];
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([{ name: "", amount: 0 }]);
  const [activeMethod, setActiveMethod] = useState(methods[1]);
  const [transactions, setTransactions] = useState([]);
  const [fourEnvelopes, setFourEnvelopes] = useState([]);
  const [sixJars, setSixJars] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // 1) Читаем планы из localStorage прямо в useState
  const [plans, setPlans] = useLocalStorageState("financialPlans", []);

  // 2) Флаг, чтобы не сохранять plans при первом рендере
  const isFirstRender = useRef(true);

  // 3) Сохраняем plans в localStorage только после первого рендера
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("financialPlans", JSON.stringify(plans));
  }, [plans]);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remainder = Math.max(0, income - totalExpenses);

  // Загрузка транзакций и бюджетов один раз
  useEffect(() => {
    const tx = JSON.parse(localStorage.getItem("expenses")) || [];
    const bgs = JSON.parse(localStorage.getItem("budgets")) || [];
    setTransactions(tx);
    setBudgets(bgs);
  }, []);

  // preset для 6 кувшинов
  const jarsPreset = [
    { label: "Необходимое", percent: 55 },
    { label: "Сбережения", percent: 10 },
    { label: "Образование", percent: 10 },
    { label: "Инвестиции", percent: 10 },
    { label: "Развлечения", percent: 10 },
    { label: "Пожертвования", percent: 5 },
  ];

  // Инициализация 6 кувшинов при смене метода или остатка
  useEffect(() => {
    if (activeMethod === "6 кувшинов") {
      setSixJars(
        jarsPreset.map((jar) => ({
          ...jar,
          amount: (remainder * jar.percent) / 100,
          selectedIds: [],
        }))
      );
    }
  }, [activeMethod, remainder]);

  // Инициализация 4 конвертов при смене метода или остатка
  const initializeEnvelopes = () => {
    const portion = remainder / 4;
    setFourEnvelopes(
      Array.from({ length: 4 }, (_, i) => ({
        label: `Неделя ${i + 1}`,
        amount: portion,
        selectedIds: [],
      }))
    );
  };

  useEffect(() => {
    if (activeMethod === "4 конверта") {
      initializeEnvelopes();
    }
  }, [activeMethod, remainder]);

  // Работа с транзакциями в кувшинах
  const handleJarSelect = (jarIndex, txId) => {
    setSixJars((prev) =>
      prev.map((jar, i) =>
        i === jarIndex ? { ...jar, selectedIds: txId ? [txId] : [] } : jar
      )
    );
  };
  const getJarSpent = (jar) =>
    transactions
      .filter((tx) => jar.selectedIds.includes(tx.id))
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

  // Работа с транзакциями в конвертах
  const toggleTransaction = (envelopeIndex, txId) => {
    setFourEnvelopes((prev) =>
      prev.map((env, i) => {
        if (i !== envelopeIndex) return env;
        const selected = env.selectedIds.includes(txId)
          ? env.selectedIds.filter((id) => id !== txId)
          : [...env.selectedIds, txId];
        return { ...env, selectedIds: selected };
      })
    );
  };
  const getEnvelopeSpent = (env) =>
    transactions
      .filter((tx) => env.selectedIds.includes(tx.id))
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

  // Обновление savedAmount у выбранного плана
  const updatePlanSavedAmount = (planId, amountChange) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              savedAmount: Math.max(plan.savedAmount + amountChange, 0),
            }
          : plan
      )
    );
  };

  // Управление окном выбора цели
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [transferSource, setTransferSource] = useState(null); // "fourEnvelopes" или "sixJars"
  const [transferIndex, setTransferIndex] = useState(null);

  const openGoalSelector = (source, index) => {
    setTransferSource(source);
    setTransferIndex(index);
    setShowGoalSelector(true);
    setSelectedPlanId("");
  };

  const handleTransferToGoal = () => {
    if (!selectedPlanId) {
      alert("Пожалуйста, выберите цель для перевода");
      return;
    }

    let amountToTransfer = 0;

    if (transferSource === "fourEnvelopes") {
      const env = fourEnvelopes[transferIndex];
      const spent = getEnvelopeSpent(env);
      amountToTransfer = env.amount - spent;
      if (amountToTransfer <= 0) {
        alert("Нет доступного остатка в этом конверте");
        return;
      }
      updatePlanSavedAmount(selectedPlanId, amountToTransfer);
      setFourEnvelopes((prev) =>
        prev.map((env, i) =>
          i === transferIndex ? { ...env, amount: spent, selectedIds: [] } : env
        )
      );
    } else if (transferSource === "sixJars") {
      const jar = sixJars[transferIndex];
      const spent = getJarSpent(jar);
      amountToTransfer = jar.amount - spent;
      if (amountToTransfer <= 0) {
        alert("Нет доступного остатка в этом кувшине");
        return;
      }
      updatePlanSavedAmount(selectedPlanId, amountToTransfer);
      setSixJars((prev) =>
        prev.map((jar, i) =>
          i === transferIndex ? { ...jar, amount: spent, selectedIds: [] } : jar
        )
      );
    }

    alert(`Переведено ${amountToTransfer.toFixed(2)} ₽ в выбранную цель`);
    setShowGoalSelector(false);
  };

  return (
    <div>
      <div className="input-block">
        <label>Ежемесячный доход</label>
        <input
          type="number"
          min={0}
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
        />
      </div>

      <div className="tabs">
        {methods.map((method) => (
          <button
            key={method}
            className={`tab ${method === activeMethod ? "active" : ""}`}
            onClick={() => setActiveMethod(method)}
          >
            {method}
          </button>
        ))}
      </div>

      {/* Блок 4 конверта */}
      {activeMethod === "4 конверта" && (
        <div>
          <h3>Метод 4 конверта</h3>
          {fourEnvelopes.map((env, i) => {
            const spent = getEnvelopeSpent(env);
            const left = env.amount - spent;
            const selectedId = env.selectedIds[0] || "";

            const handleEnvelopeSelect = (envelopeIndex, txId) => {
              setFourEnvelopes((prev) =>
                prev.map((env, idx) =>
                  idx === envelopeIndex
                    ? { ...env, selectedIds: txId ? [txId] : [] }
                    : env
                )
              );
            };

            return (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <strong>{env.label}</strong>
                <p>Выделено: {env.amount.toFixed(2)} ₽</p>
                <p>Потрачено: {spent.toFixed(2)} ₽</p>
                <p>Остаток: {left.toFixed(2)} ₽</p>

                <label>Выберите транзакцию:</label>
                <select
                  value={selectedId}
                  onChange={(e) => handleEnvelopeSelect(i, e.target.value)}
                >
                  <option value="">— Не выбрано —</option>
                  {budgets.map((b) => (
                    <optgroup key={b.id} label={b.name}>
                      {transactions
                        .filter((tx) => tx.budgetId === b.id)
                        .map((tx) => (
                          <option key={tx.id} value={tx.id}>
                            {tx.name} — {tx.amount.toLocaleString()} ₽
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>

                {left > 0 && (
                  <button
                    className="btn btn--dark"
                    onClick={() => openGoalSelector("fourEnvelopes", i)}
                  >
                    Перевести остаток в цель
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Блок 6 кувшинов */}
      {activeMethod === "6 кувшинов" && (
        <div>
          <h3>Метод 6 кувшинов</h3>
          {sixJars.map((jar, i) => {
            const spent = getJarSpent(jar);
            const left = jar.amount - spent;

            return (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  marginBottom: "1rem",
                  padding: "1rem",
                }}
              >
                <strong>{jar.label}</strong>
                <p>Выделено: {jar.amount.toFixed(2)} ₽</p>
                <p>Потрачено: {spent.toFixed(2)} ₽</p>
                <p>Остаток: {left.toFixed(2)} ₽</p>

                <label>Выберите транзакцию:</label>
                <select
                  value={jar.selectedIds[0] || ""}
                  onChange={(e) => handleJarSelect(i, e.target.value)}
                >
                  <option value="">— Не выбрано —</option>
                  {budgets.map((b) => (
                    <optgroup key={b.id} label={b.name}>
                      {transactions
                        .filter((tx) => tx.budgetId === b.id)
                        .map((tx) => (
                          <option key={tx.id} value={tx.id}>
                            {tx.name} — {tx.amount.toLocaleString()} ₽
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>

                {left > 0 && (
                  <button
                    className="btn btn--dark"
                    onClick={() => openGoalSelector("sixJars", i)}
                  >
                    Перевести остаток в цель
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Окно выбора цели для перевода */}
      {showGoalSelector && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setShowGoalSelector(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "5px",
              minWidth: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Выберите финансовую цель</h4>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <option value="">— Не выбрано —</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.title} — Накоплено: {plan.savedAmount.toLocaleString()}{" "}
                  ₽
                </option>
              ))}
            </select>
            <button className="btn btn--dark" onClick={handleTransferToGoal}>
              Перевести
            </button>
            <button
              className="btn btn--light"
              style={{ marginLeft: "1rem" }}
              onClick={() => setShowGoalSelector(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexibleCalculator;
