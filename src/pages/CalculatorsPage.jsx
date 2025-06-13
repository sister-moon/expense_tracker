import FinancialGoalsCalculator from "../components/FinancialGoalsCalculator";
import FlexibleCalculator from "../components/FlexibleCalculator";
import FourEnvelopesCalculator from "../components/FourEnvelopes";
import BudgetCalculator from "../components/MonthlyExpenseCategoriesCalculator";
import MonthlyExpenseCalculator from "../components/MontlyExpenseCalculator";
import SixJarsCalculator from "../components/SixJarsCalculator";

import { fetchData } from "../helpers";

export async function calculatorsLoader() {
  const calculators = fetchData("calculators");
  return { calculators };
}

const CalculatorsPage = () => {
  return (
    <div class="dashboard center">
      <MonthlyExpenseCalculator />
      <BudgetCalculator />

      {/*<FourEnvelopesCalculator />
      <SixJarsCalculator /> */}
      <FlexibleCalculator />
    </div>
  );
};

export default CalculatorsPage;
