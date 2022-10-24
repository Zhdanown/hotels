import React from "react";

type Option = {
  id: string;
  name: string;
};

export const Select = ({
  options,
  onChange,
}: {
  options: Option[];
  onChange: (v?: Option) => void;
}) => {
  options = [{ id: "", name: "Не выбрано" }, ...options];
  const onChange_ = (id: string) => {
    const item = options.find(x => String(x.id) === id);
    onChange(item);
  };

  return (
    <select onChange={({ target }) => onChange_(target.value)}>
      {options.map((o, i) => (
        <option key={i} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  );
};
