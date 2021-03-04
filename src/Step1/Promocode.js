import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Input from "../components/Input";
import { changeParams } from "../redux/booking";

export default function Promocode() {
  const dispatch = useDispatch();
  const [promo_code, setPromocode] = useState("");

  useEffect(() => {
    dispatch(changeParams({ promo_code }));
  }, [promo_code, dispatch]);

  return (
    <Input
      type="text"
      label="Промокод"
      name="promocode"
      value={promo_code}
      onChange={({ target }) => setPromocode(target.value)}
      style={{ marginBottom: "1rem" }}
    />
  );
}
