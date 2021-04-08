export function usernameIsValid(username) {
  return /^[0-9a-zA-Z_.-]+$/.test(username);
}

export function emailIsValid(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function phoneIsValid(phone) {
  const re = /^[+]?[1-9][(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(String(phone).toLowerCase());
}

export function passwordIsInvalid(password) {
  if (!/^(?=.*\d)/.test(password)) {
    return "Пароль должен содержать хотя бы 1 цифру";
  } else if (!/^(?=.*[a-z])/.test(password)) {
    return "Пароль должен содержать буквы в нижнем регистре";
  } else if (!/^(?=.*[A-Z])/.test(password)) {
    return "Пароль должен содержать буквы в верхнем регистре";
  } else if (!/^(.{8,})/.test(password)) {
    return "Длина пароля должны быть не менее 8 символов";
  }

  return false;
}

export function mapServerErrors(serverErrors) {
  return Object.keys(serverErrors).reduce((acc, current) => {
    acc = { ...acc, [current]: serverErrors[current].join("; ") };
    return acc;
  }, {});
}

export function filterFalsyObjectKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value)
  );
}
