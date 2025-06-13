import { useState, useEffect } from "react";

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
      if (typeof initialValue === "function") {
        return initialValue();
      }
      return initialValue;
    } catch (e) {
      console.error("Error reading localStorage key “" + key + "”: ", e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error("Error writing localStorage key “" + key + "”: ", e);
    }
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorageState;
