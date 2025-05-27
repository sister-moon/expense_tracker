// context/CurrencyContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("RUB");

  // Чтение/запись в localStorage
  useEffect(() => {
    const saved = localStorage.getItem("preferredCurrency");
    if (saved) setCurrency(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("preferredCurrency", currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Хук для использования
export const useCurrency = () => useContext(CurrencyContext);
