import React, { useEffect, useState } from "react";
import { fetchData } from "../helpers";

export async function directLoader() {
  const direct = fetchData("direct");
  return { direct };
}

function ReferenceBook() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("referenceEntries");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    type: "Доход",
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = () => {
    if (!formData.name.trim()) return alert("Название обязательно!");

    const newEntry = {
      id: Date.now(),
      ...formData,
    };

    setEntries((prev) => [...prev, newEntry]);
    setFormData({ type: "Доход", name: "", description: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Удалить эту запись?")) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const handleEdit = (id) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    const newName = prompt("Новое название:", entry.name);
    if (!newName?.trim()) return;

    const newDesc = prompt(
      "Новое описание (можно оставить пустым):",
      entry.description || ""
    );
    const newType = prompt("Тип (Доход/Расход):", entry.type)?.toLowerCase();

    if (newType !== "Доход" && newType !== "Расход" && newType !== "Долг") {
      alert("Тип должен быть 'Доход' или 'Расход', или 'Долг");
      return;
    }

    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, name: newName, description: newDesc, type: newType }
          : e
      )
    );
  };

  // сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem("referenceEntries", JSON.stringify(entries));
  }, [entries]);

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="Доход">Доход</option>
          <option value="Расход">Расход</option>
          <option value="Долг">Долг</option>
        </select>

        <input
          name="name"
          placeholder="Название"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="description"
          placeholder="Описание (необязательно)"
          value={formData.description}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={handleAddEntry} style={styles.button}>
          Добавить
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <div>
        {entries.length === 0 ? (
          <p>Нет записей</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Тип</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.type}</td>
                  <td>{entry.name}</td>
                  <td>{entry.description || "-"}</td>
                  <td>
                    <button
                      style={styles.action}
                      onClick={() => handleEdit(entry.id)}
                    >
                      ✏️
                    </button>
                    <button
                      style={styles.action}
                      onClick={() => handleDelete(entry.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  select: {
    padding: "6px",
    minWidth: "100px",
  },
  input: {
    padding: "6px",
    flex: "1",
    minWidth: "150px",
  },
  button: {
    padding: "8px 14px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  action: {
    marginRight: "10px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default ReferenceBook;
