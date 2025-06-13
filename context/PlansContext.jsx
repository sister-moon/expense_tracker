import React, { createContext } from "react";
import useLocalStorageState from "../hooks/useLocalStorageState";

// 1) Сам контекст
export const PlansContext = createContext({
  plans: [],
  setPlans: () => {},
});

// 2) Провайдер, который оборачивает потомков и даёт доступ к plans/setPlans
export const PlansProvider = ({ children }) => {
  // useLocalStorageState: хранит и синхронизирует plans ↔ localStorage
  const [plans, setPlans] = useLocalStorageState("financialPlans", []);

  return (
    <PlansContext.Provider value={{ plans, setPlans }}>
      {children}
    </PlansContext.Provider>
  );
};
