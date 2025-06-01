// Пример замоканных транзакций:
const mockTransactions = [
  {
    id: "f8c48934-baa2-4e31-b131-99af0e508d8f",
    name: "Чокопай",
    createdAt: 1748753440868,
    amount: 170,
    budgetId: "95c5f5d2-910a-4a7c-8755-2956380a5cf5",
  },
  {
    id: "a12b3c45-d678-4e90-ab12-34cd56ef7890",
    name: "Кофе в Старбакс",
    createdAt: 1748740000000,
    amount: 250,
    budgetId: "95c5f5d2-910a-4a7c-8755-2956380a5cf5",
  },
  {
    id: "b98f7654-c321-4d09-b456-78ab90cd1234",
    name: "Оплата ЖКХ",
    createdAt: 1748760000000,
    amount: 3200,
    budgetId: "123e4567-e89b-12d3-a456-426614174000",
  },
  {
    id: "c01d2345-e678-4f12-c345-56de78ab9012",
    name: "Покупка книг",
    createdAt: 1748765000000,
    amount: 1200,
    budgetId: "123e4567-e89b-12d3-a456-426614174000",
  },
  {
    id: "d23f4567-a890-4b12-d678-90ef12ab3456",
    name: "Абонемент в спортзал",
    createdAt: 1748770000000,
    amount: 1500,
    budgetId: "abcdef12-3456-7890-abcd-ef1234567890",
  },
];

// Для загрузки в localStorage:
localStorage.setItem("expenses", JSON.stringify(mockTransactions));
