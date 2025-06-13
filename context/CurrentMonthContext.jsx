import { createContext, useContext, useState } from "react";

export const CurrentMonthContext = createContext();

export const CurrentMonthProvider = ({ children }) => {
  const now = new Date();
  const initialMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  return (
    <CurrentMonthContext.Provider value={{ currentMonth, setCurrentMonth }}>
      {children}
    </CurrentMonthContext.Provider>
  );
};

export const useCurrentMonth = () => useContext(CurrentMonthContext);
