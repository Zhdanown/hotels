const fields = [
  { type: "text", label: "Логин", name: "username" },
  { type: "text", label: "Имя", name: "first_name" },
  { type: "text", label: "Фамилия", name: "last_name" },
  { type: "text", label: "Отчество", name: "middle_name" },
  { type: "email", label: "Email", name: "email" },
  { type: "tel", label: "Телефон", name: "phone", mask: "+7(999) 999 9999" },
  { type: "password", label: "Пароль", name: "password" },
  { type: "password", label: "Повторите пароль", name: "password_confirm" },
];

export default fields;
