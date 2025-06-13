import { Form } from "react-router-dom";

// library
import { UserPlusIcon } from "@heroicons/react/24/solid";

const Intro = () => {
  return (
    <div className="intro">
      <div>
        <h1>
          Верните контроль над <span className="accent">Вашими деньгами!</span>
        </h1>
        <p>
          Учёт расходов - это секрет финансовой свободы. Начните свое финансовое
          путешествие сегодня.
        </p>
        <Form method="post">
          <input
            type="text"
            name="userName"
            required
            placeholder="Как Вас зовут?"
            aria-label="Ваше имя"
            autoComplete="given-name"
          />
          <input type="hidden" name="_action" value="newUser" />
          <button type="submit" className="btn btn--dark">
            <span>Создать пользователя</span>
            <UserPlusIcon width={20} />
          </button>
        </Form>
      </div>
    </div>
  );
};
export default Intro;
