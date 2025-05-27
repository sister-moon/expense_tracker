import { useCurrency } from "../context/CurrencyContext";
import { currencies } from "../data/currencies";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="currency" className="text-sm font-medium">
        Валюта:
      </label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="p-2 border rounded-md"
      >
        {currencies.map(({ code, name, flag }) => (
          <option key={code} value={code}>
            {flag} {code} — {name}
          </option>
        ))}
      </select>
    </div>
  );
}
