// rrd imports
import { Form, NavLink } from "react-router-dom";

// assets
import transitions from "../assets/transaction-svgrepo-com.svg";
import monthly from "../assets/calculator-svgrepo-com.svg";
import savings from "../assets/piggy-bank-svgrepo-com.svg";
import direct from "../assets/directory-submission-symbol-svgrepo-com.svg";

const Nav = ({ userName }) => {
  return (
    <nav>
      <NavLink to="/" aria-label="Go to home">
        <img src={transitions} alt="" height={30} />
        <span>Транзакции</span>
      </NavLink>
      <NavLink to="/calculators" aria-label="Go to financial calculators">
        <img src={monthly} alt="" height={40} />
        <span>Калькуляторы</span>
      </NavLink>
      <NavLink to="/plans" aria-label="Go to home">
        <img src={savings} alt="" height={40} />
        <span>Накопления</span>
      </NavLink>
      <NavLink to="/direct" aria-label="Go to home">
        <img src={direct} alt="" height={40} />
        <span>Справочники</span>
      </NavLink>
      {userName && (
        <Form
          method="post"
          action="logout"
          onSubmit={(event) => {
            if (!confirm("Удалить пользователя и все данные?")) {
              event.preventDefault();
            }
          }}
        >
          <button type="submit" className="btn btn--warning">
            <span>Выйти</span>
          </button>
        </Form>
      )}
    </nav>
  );
};
export default Nav;
