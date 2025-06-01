import React, { useState, useRef, useEffect } from "react";

function TransactionMultiSelect({
  budgets,
  transactions,
  selectedIds,
  onChange,
  placeholder = "Выберите транзакции...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setFilter("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredTx = transactions.filter((tx) =>
    tx.name.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleTx = (txId) => {
    if (selectedIds.includes(txId)) {
      onChange(selectedIds.filter((id) => id !== txId));
    } else {
      onChange([...selectedIds, txId]);
    }
  };

  const budgetMap = budgets.reduce((acc, b) => {
    acc[b.id] = b.name;
    return acc;
  }, {});

  const grouped = {};
  filteredTx.forEach((tx) => {
    const bname = budgetMap[tx.budgetId] || "Без категории";
    if (!grouped[bname]) grouped[bname] = [];
    grouped[bname].push(tx);
  });

  return (
    <div className="tms-container" ref={containerRef}>
      {/* Поле с «чипами» и инпутом */}
      <div
        className={`tms-control ${isOpen ? "tms-control--focused" : ""}`}
        onClick={() => setIsOpen(true)}
      >
        {selectedIds.map((id) => {
          const tx = transactions.find((t) => t.id === id);
          if (!tx) return null;
          return (
            <div key={id} className="tms-chip">
              <span className="tms-chip__label">{tx.name}</span>
              <button
                type="button"
                className="tms-chip__remove"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTx(id);
                }}
                aria-label="Удалить"
              >
                &times;
              </button>
            </div>
          );
        })}

        <input
          type="text"
          className="tms-input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="tms-dropdown">
          {filteredTx.length === 0 && (
            <div className="tms-no-results">Не найдено</div>
          )}

          {Object.entries(grouped).map(([bname, txs]) => (
            <div key={bname} className="tms-group">
              <div className="tms-group__label">{bname}</div>
              {txs.map((tx) => (
                <label key={tx.id} className="tms-item">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(tx.id)}
                    onChange={() => toggleTx(tx.id)}
                    className="tms-item__checkbox"
                  />
                  <span className="tms-item__text">
                    {tx.name} — {tx.amount.toLocaleString()} ₽
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionMultiSelect;
