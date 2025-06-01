// FlexibleCalculator.jsx
import React, { useContext, useEffect, useState, useCallback } from "react";
import { PlansContext } from "../context/PlansContext";
import TransactionMultiSelect from "./TransactionMultiSelect";

const STORAGE_KEY = "flexibleBudgetData";

const FlexibleCalculator = () => {
  const methods = ["4 конверта", "6 кувшинов"];
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [activeMethod, setActiveMethod] = useState(methods[0]);
  const [buckets, setBuckets] = useState([]);
  const [weeklyBalances, setWeeklyBalances] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const { plans, setPlans } = useContext(PlansContext);
  const [isDirty, setIsDirty] = useState(false);
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [transferBucketId, setTransferBucketId] = useState(null);

  // Локальный стейт для хранения текущего значения остатка (planned – spent) по каждому бакету
  const [localRests, setLocalRests] = useState({});

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.monthlyIncome === "number" &&
          methods.includes(parsed.method) &&
          Array.isArray(parsed.buckets)
        ) {
          setMonthlyIncome(parsed.monthlyIncome);
          setActiveMethod(parsed.method);

          // Восстанавливаем массив buckets, где planned сохраняется как есть
          const loaded = parsed.buckets.map((b) => ({
            id: b.id,
            label: b.label,
            ...(parsed.method === "6 кувшинов" ? { percent: b.percent } : {}),
            planned: typeof b.planned === "number" ? b.planned : 0,
            selectedIds: Array.isArray(b.selectedIds) ? b.selectedIds : [],
          }));

          // Проверяем, соответствует ли длина массива ожиданиям
          if (
            (parsed.method === "4 конверта" && loaded.length === 4) ||
            (parsed.method === "6 кувшинов" && loaded.length === 6)
          ) {
            setBuckets(loaded);
          } else {
            initializeBuckets(parsed.method, parsed.monthlyIncome);
          }

          if (
            parsed.weeklyBalances &&
            typeof parsed.weeklyBalances === "object"
          ) {
            setWeeklyBalances(parsed.weeklyBalances);
          }

          setIsDirty(false);
          return;
        }
      } catch {
        console.warn("Не удалось распарсить данные бюджета из localStorage");
      }
    }
    // Если данных нет или они некорректны — инициализируем заново
    initializeBuckets(activeMethod, monthlyIncome);
  }, []);

  // Загрузка списка транзакций и бюджетов (из локального хранилища «expenses» и «budgets»)
  useEffect(() => {
    const tx = JSON.parse(localStorage.getItem("expenses")) || [];
    const bgs = JSON.parse(localStorage.getItem("budgets")) || [];
    setTransactions(tx);
    setBudgets(bgs);
  }, []);

  // Если сменился метод или доход — сбрасываем бакеты
  useEffect(() => {
    initializeBuckets(activeMethod, monthlyIncome);
    markDirty();
  }, [activeMethod, monthlyIncome]);

  // Вычисление spent для каждого бакета
  const getSpent = useCallback(
    (bucket) => {
      return (bucket.selectedIds || []).reduce((sum, txId) => {
        const tx = transactions.find((t) => t.id === txId);
        return sum + (tx ? Number(tx.amount) : 0);
      }, 0);
    },
    [transactions]
  );

  // После каждого изменения buckets (или транзакций) пересчитываем локальные остатки и weeklyBalances
  useEffect(() => {
    const newRests = {};
    const newBalances = {};
    buckets.forEach((b) => {
      const spent = getSpent(b);
      const rest = b.planned - spent;
      newRests[b.id] = rest < 0 ? 0 : rest;
      newBalances[b.id] = rest;
    });
    setLocalRests(newRests);
    setWeeklyBalances(newBalances);
  }, [buckets, getSpent]);

  // Функция инициализации бакетов
  const initializeBuckets = useCallback((method, income) => {
    if (method === "4 конверта") {
      const portion = income / 4;
      const arr = Array.from({ length: 4 }, (_, i) => ({
        id: `week${i + 1}`,
        label: `Неделя ${i + 1}`,
        planned: portion,
        selectedIds: [],
      }));
      setBuckets(arr);
    } else if (method === "6 кувшинов") {
      const presets = [
        { id: "jar1", label: "Необходимое", percent: 55 },
        { id: "jar2", label: "Сбережения", percent: 10 },
        { id: "jar3", label: "Образование", percent: 10 },
        { id: "jar4", label: "Инвестиции", percent: 10 },
        { id: "jar5", label: "Развлечения", percent: 10 },
        { id: "jar6", label: "Пожертвования", percent: 5 },
      ];
      const arr = presets.map((p) => ({
        id: p.id,
        label: p.label,
        percent: p.percent,
        planned: (income * p.percent) / 100,
        selectedIds: [],
      }));
      setBuckets(arr);
    }
  }, []);

  function markDirty() {
    setIsDirty(true);
  }

  const handleIncomeChange = (e) => {
    const val = Number(e.target.value);
    setMonthlyIncome(isNaN(val) ? 0 : val);
    markDirty();
  };

  // При изменении localRests (остатка) пересчитываем planned = rest + spent
  const handleRestChange = (bucketId, inputValue) => {
    const restVal = Number(inputValue);
    setLocalRests((prev) => ({
      ...prev,
      [bucketId]: isNaN(restVal) || restVal < 0 ? 0 : restVal,
    }));

    const bucket = buckets.find((b) => b.id === bucketId);
    if (!bucket) return;

    const spent = getSpent(bucket);
    const newPlanned = (isNaN(restVal) || restVal < 0 ? 0 : restVal) + spent;

    setBuckets((prev) =>
      prev.map((b) => (b.id === bucketId ? { ...b, planned: newPlanned } : b))
    );
    markDirty();
  };

  // При выборе транзакций обновляем selectedIds
  const handleSelectTransactions = (bucketId, newSelectedIds) => {
    setBuckets((prev) =>
      prev.map((b) =>
        b.id === bucketId ? { ...b, selectedIds: newSelectedIds || [] } : b
      )
    );
    markDirty();
  };

  const openGoalSelector = (bucketId) => {
    setTransferBucketId(bucketId);
    setSelectedPlanId("");
    setShowGoalSelector(true);
  };

  const handleTransferToGoal = () => {
    if (!selectedPlanId) {
      alert("Пожалуйста, выберите цель для перевода");
      return;
    }
    const b = buckets.find((x) => x.id === transferBucketId);
    if (!b) return;

    const spent = getSpent(b);
    const balance = b.planned - spent;
    if (balance <= 0) {
      alert("Нет доступного остатка для перевода");
      return;
    }

    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === Number(selectedPlanId)
          ? { ...plan, savedAmount: plan.savedAmount + balance }
          : plan
      )
    );

    // Сбрасываем planned до суммы потраченного, очищаем выбранные транзакции
    setBuckets((prev) =>
      prev.map((bckt) =>
        bckt.id === transferBucketId
          ? { ...bckt, planned: spent, selectedIds: [] }
          : bckt
      )
    );

    markDirty();
    setShowGoalSelector(false);
    alert(`Переведено ${balance.toLocaleString()} ₽ в выбранную цель`);
  };

  const handleSave = () => {
    const actualBalances = {};
    buckets.forEach((b) => {
      const spent = (b.selectedIds || []).reduce((sum, txId) => {
        const tx = transactions.find((t) => t.id === txId);
        return sum + (tx ? Number(tx.amount) : 0);
      }, 0);
      actualBalances[b.id] = b.planned - spent;
    });

    const dataToSave = {
      monthlyIncome,
      method: activeMethod,
      buckets: buckets.map((b) => ({
        id: b.id,
        label: b.label,
        ...(activeMethod === "6 кувшинов" ? { percent: b.percent } : {}),
        planned: b.planned,
        selectedIds: b.selectedIds || [],
      })),
      weeklyBalances: actualBalances,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setIsDirty(false);
    alert("Данные сохранены");
  };

  const handleCarryover = () => {
    alert("Функция переноса на следующий месяц ещё не реализована");
  };

  // ---------------------------------------------
  // Рендер компонента
  // ---------------------------------------------
  return (
    <div style={styles.container}>
      <h2>Гибкий калькулятор ({activeMethod})</h2>

      {/* Ввод ежемесячного дохода */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Ежемесячный доход:</label>
        <input
          type="number"
          min={0}
          value={monthlyIncome}
          onChange={handleIncomeChange}
          style={styles.input}
        />
      </div>

      {/* Переключение метода */}
      <div style={{ marginTop: 20 }}>
        {methods.map((method) => (
          <button
            key={method}
            onClick={() => setActiveMethod(method)}
            style={{
              ...styles.tab,
              ...(method === activeMethod ? styles.tabActive : {}),
            }}
          >
            {method}
          </button>
        ))}
      </div>

      {/* Секция «конвертов» или «кувшинов» */}
      <div style={{ marginTop: 20 }}>
        <h3>
          {activeMethod === "4 конверта"
            ? "Метод 4 конверта"
            : "Метод 6 кувшинов"}
        </h3>

        {buckets.map((b) => {
          const spent = getSpent(b);
          const balance = b.planned - spent;
          const displayRest =
            localRests[b.id] !== undefined ? localRests[b.id] : 0;

          return (
            <div key={b.id} style={styles.bucketRow}>
              <div style={styles.bucketInfo}>
                <strong>{b.label}</strong>

                {activeMethod === "6 кувшинов" && (
                  <div style={styles.smallText}>({b.percent}% от дохода)</div>
                )}

                {/* Инпут «Запланировано» (показывает остаток) */}
                <div style={styles.smallText}>
                  Запланировано:{" "}
                  <input
                    type="number"
                    min={0}
                    value={displayRest}
                    onChange={(e) => handleRestChange(b.id, e.target.value)}
                    style={{ ...styles.input, width: 100 }}
                  />{" "}
                  ₽
                </div>

                <div style={styles.smallText}>
                  Потрачено: <span>{spent.toLocaleString()} ₽</span>
                </div>
                <div style={styles.smallText}>
                  Остаток:{" "}
                  <span style={{ fontWeight: 600 }}>
                    {balance.toLocaleString()} ₽
                  </span>
                </div>

                {/* Мультиселект транзакций */}
                <div style={{ marginTop: 8 }}>
                  <label style={styles.labelSmall}>Транзакции:</label>
                  <TransactionMultiSelect
                    budgets={budgets}
                    transactions={transactions}
                    selectedIds={b.selectedIds || []}
                    onChange={(newIds) =>
                      handleSelectTransactions(b.id, newIds)
                    }
                    placeholder="Начните ввод или кликните..."
                  />
                </div>

                {/* Кнопка «Перевести остаток в цель» */}
                {balance > 0 && (
                  <button
                    onClick={() => openGoalSelector(b.id)}
                    style={styles.transferButton}
                  >
                    Перевести остаток в цель
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Кнопки «Сохранить» и «Перенести остаток» */}
      <div style={styles.buttonsRow}>
        <button
          onClick={handleSave}
          style={{
            ...styles.saveButton,
            opacity: isDirty ? 1 : 0.5,
            cursor: isDirty ? "pointer" : "not-allowed",
          }}
          disabled={!isDirty}
        >
          Сохранить изменения
        </button>

        <button onClick={handleCarryover} style={styles.carryButton}>
          Перенести остаток на следующий месяц
        </button>
      </div>

      {/* Модалка выбора цели для перевода */}
      {showGoalSelector && (
        <div
          style={styles.modalBackdrop}
          onClick={() => setShowGoalSelector(false)}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h4>Выберите финансовую цель</h4>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              style={{ width: "100%", padding: "6px", fontSize: "1rem" }}
            >
              <option value="">— Не выбрано —</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.title} — Накоплено: {plan.savedAmount.toLocaleString()}{" "}
                  ₽
                </option>
              ))}
            </select>
            <div style={{ marginTop: 12, textAlign: "right" }}>
              <button
                onClick={handleTransferToGoal}
                style={styles.transferConfirmButton}
              >
                Перевести
              </button>
              <button
                onClick={() => setShowGoalSelector(false)}
                style={styles.transferCancelButton}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexibleCalculator;

// -------------------------------------
// Встроенные стили (CSS-in-JS)
// -------------------------------------
const styles = {
  container: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  label: {
    fontWeight: 600,
  },
  labelSmall: {
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  input: {
    padding: "6px 8px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
  tab: {
    padding: "8px 16px",
    marginRight: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
  },
  tabActive: {
    backgroundColor: "#007bff",
    color: "#fff",
    borderColor: "#007bff",
  },
  bucketRow: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "16px",
    backgroundColor: "#fafafa",
  },
  bucketInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  smallText: {
    fontSize: "0.9rem",
    color: "#555",
  },
  transferButton: {
    marginTop: "10px",
    alignSelf: "flex-start",
    padding: "6px 12px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  buttonsRow: {
    marginTop: "24px",
    display: "flex",
    gap: "12px",
  },
  saveButton: {
    padding: "10px 18px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  carryButton: {
    padding: "10px 18px",
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  // Стили для модалки выбора цели
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "6px",
    width: "320px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  transferConfirmButton: {
    padding: "6px 14px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    marginRight: "8px",
    cursor: "pointer",
  },
  transferCancelButton: {
    padding: "6px 14px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
