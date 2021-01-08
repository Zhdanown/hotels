import React from "react";

function Step3() {
  return (
    <div>
      <h3>Подтверждение бронирования</h3>
      <form action="">
        <InputField type="email" label="Email" name="email" />
        <InputField type="text" label="Login" name="login" />
        <InputField type="password" label="Password" name="password" />
      </form>
    </div>
  );
}

export default Step3;

function InputField({ type, label, name }) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', margin: '.5rem'}}>
      <label htmlFor={name}>{label}</label>
      <input type={type} name={name} id={name} />
    </div>
  );
}
