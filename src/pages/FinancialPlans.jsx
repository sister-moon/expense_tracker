import React, { useEffect, useState } from "react";
import { fetchData } from "../helpers";

export async function plansLoader() {
  const plans = fetchData("plans");
  return { plans };
}

function FinancialPlans() {
  // Сразу загружаем планы из localStorage в useState!
  const [plans, setPlans] = useState(() => {
    const savedPlans = localStorage.getItem("financialPlans");
    return savedPlans ? JSON.parse(savedPlans) : [];
  });

  // Сохраняем планы в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("financialPlans", JSON.stringify(plans));
  }, [plans]);

  const addNewPlan = () => {
    const title = prompt("Введите название цели:");
    const targetAmount = prompt("Введите целевую сумму:");

    if (title && targetAmount && !isNaN(targetAmount)) {
      const newPlan = {
        id: Date.now(),
        title,
        targetAmount: Number(targetAmount),
        savedAmount: 0,
      };
      setPlans((prev) => [...prev, newPlan]);
    }
  };

  const updateSavedAmount = (id, amountChange) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              savedAmount: Math.max(plan.savedAmount + amountChange, 0),
            }
          : plan
      )
    );
  };

  const handleAddMoney = (id) => {
    const amount = parseFloat(prompt("Введите сумму для добавления:"));
    if (!isNaN(amount) && amount > 0) {
      updateSavedAmount(id, amount);
    }
  };

  const handleSubtractMoney = (id) => {
    const amount = parseFloat(prompt("Введите сумму для снятия:"));
    if (!isNaN(amount) && amount > 0) {
      updateSavedAmount(id, -amount);
    }
  };

  const handleDeletePlan = (id) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить этот план?"
    );
    if (confirmDelete) {
      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== id));
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={addNewPlan}>
        ➕ Добавить план
      </button>

      {plans.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Нет сохранённых целей. Добавьте новую!
        </p>
      ) : (
        <div style={styles.planList}>
          {plans.map((plan) => {
            const progress = Math.min(
              Math.round((plan.savedAmount / plan.targetAmount) * 100),
              100
            );
            const isCompleted = progress === 100;

            return (
              <div key={plan.id} style={styles.card}>
                <h2 style={styles.cardTitle}>{plan.title}</h2>
                <p>Цель: {plan.targetAmount.toLocaleString()} ₽</p>
                <p>Накоплено: {plan.savedAmount.toLocaleString()} ₽</p>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${progress}%`,
                      backgroundColor: isCompleted ? "#4CAF50" : "#2196F3",
                    }}
                  />
                </div>

                <p style={{ marginTop: 10 }}>
                  Прогресс: {progress}% {isCompleted && "🎉 Завершено!"}
                </p>

                <div style={styles.buttonGroup}>
                  <button
                    style={{
                      ...styles.smallButton,
                      backgroundColor: "#4CAF50",
                    }}
                    onClick={() => handleAddMoney(plan.id)}
                  >
                    ➕ Пополнить
                  </button>
                  <button
                    style={{
                      ...styles.smallButton,
                      backgroundColor: "#f44336",
                    }}
                    onClick={() => handleSubtractMoney(plan.id)}
                  >
                    ➖ Снять
                  </button>
                  <button
                    style={{ ...styles.smallButton, backgroundColor: "#888" }}
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    marginBottom: "20px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  planList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  cardTitle: {
    marginBottom: "10px",
    fontSize: "20px",
    color: "#333",
  },
  progressBar: {
    width: "100%",
    height: "10px",
    backgroundColor: "#eee",
    borderRadius: "5px",
    overflow: "hidden",
    marginTop: "10px",
  },
  progressFill: {
    height: "100%",
    transition: "width 0.3s ease",
  },
  buttonGroup: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  smallButton: {
    flex: "1 1 30%",
    padding: "8px 10px",
    fontSize: "14px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
  },
};

export default FinancialPlans;
