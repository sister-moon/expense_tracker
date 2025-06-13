// src/mocks/mocks.js

export const mockBudgets = [
  {
    id: "556c7b21-4c91-424b-a1fd-7c5f6c80ce48",
    name: "Продукты",
    amount: 15000,
    createdAt: Date.now(),
    spent: 0,
    color: "0 65% 50%",
  },
  {
    id: "e29b08b3-3485-4ca2-9029-2c18dee186f2",
    name: "Жильё и коммуналка",
    amount: 7000,
    createdAt: Date.now(),
    spent: 0,
    color: "32 65% 50%",
  },
  {
    id: "0f9860ae-6065-4c5c-8e7e-4ee7c9872ef0",
    name: "Транспорт",
    amount: 3000,
    createdAt: Date.now(),
    spent: 0,
    color: "64 65% 50%",
  },
  {
    id: "eeda63ca-b416-4c63-9320-0baa6d1e85a4",
    name: "Связь и интернет",
    amount: 1000,
    createdAt: Date.now(),
    spent: 0,
    color: "96 65% 50%",
  },
  {
    id: "23b79fd9-fe81-48c4-b102-2c011b72a82d",
    name: "Здоровье",
    amount: 2000,
    createdAt: Date.now(),
    spent: 0,
    color: "128 65% 50%",
  },
  {
    id: "4414ff3d-c1f8-457b-8bcb-844ae363aa9a",
    name: "Одежда",
    amount: 3000,
    createdAt: Date.now(),
    spent: 0,
    color: "160 65% 50%",
  },
  {
    id: "5c1ec69c-d449-466e-a450-7f9fe3657132",
    name: "Развлечения",
    amount: 2500,
    createdAt: Date.now(),
    spent: 0,
    color: "192 65% 50%",
  },
  {
    id: "b4be1f10-a342-4fb0-8595-615d7456ac0a",
    name: "Образование",
    amount: 1500,
    createdAt: Date.now(),
    spent: 0,
    color: "224 65% 50%",
  },
  {
    id: "1c41f254-d8d1-4162-b30f-62230003350a",
    name: "Сбережения",
    amount: 5000,
    createdAt: Date.now(),
    spent: 0,
    color: "256 65% 50%",
  },
];

export const mockExpenses = [
  {
    id: "tx-1",
    name: "Покупка продуктов в магазине",
    amount: 1200,
    createdAt: "2025-06-10T12:00:00Z",
    budgetId: "556c7b21-4c91-424b-a1fd-7c5f6c80ce48", // Продукты
  },
  {
    id: "tx-2",
    name: "Оплата аренды квартиры",
    amount: 7000,
    createdAt: "2025-06-01T08:30:00Z",
    budgetId: "e29b08b3-3485-4ca2-9029-2c18dee186f2", // Жильё и коммуналка
  },
  {
    id: "tx-3",
    name: "Поездка на такси",
    amount: 500,
    createdAt: "2025-05-22T19:00:00Z",
    budgetId: "0f9860ae-6065-4c5c-8e7e-4ee7c9872ef0", // Транспорт
  },
  {
    id: "tx-4",
    name: "Интернет за июнь",
    amount: 1000,
    createdAt: "2025-06-03T14:00:00Z",
    budgetId: "eeda63ca-b416-4c63-9320-0baa6d1e85a4", // Связь и интернет
  },
  {
    id: "tx-5",
    name: "Визит к врачу",
    amount: 2000,
    createdAt: "2025-04-15T10:00:00Z",
    budgetId: "23b79fd9-fe81-48c4-b102-2c011b72a82d", // Здоровье
  },
  {
    id: "tx-6",
    name: "Покупка футболки",
    amount: 1500,
    createdAt: "2025-05-10T16:00:00Z",
    budgetId: "4414ff3d-c1f8-457b-8bcb-844ae363aa9a", // Одежда
  },
  {
    id: "tx-7",
    name: "Кинотеатр",
    amount: 700,
    createdAt: "2025-06-12T20:00:00Z",
    budgetId: "5c1ec69c-d449-466e-a450-7f9fe3657132", // Развлечения
  },
  {
    id: "tx-8",
    name: "Курс по программированию",
    amount: 1500,
    createdAt: "2025-03-25T11:00:00Z",
    budgetId: "b4be1f10-a342-4fb0-8595-615d7456ac0a", // Образование
  },
  {
    id: "tx-9",
    name: "Перевод на сберегательный счет",
    amount: 5000,
    createdAt: "2025-06-01T09:00:00Z",
    budgetId: "1c41f254-d8d1-4162-b30f-62230003350a", // Сбережения
  },
];
