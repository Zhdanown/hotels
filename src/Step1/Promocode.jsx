import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../components/Input";
import { changeParams, getParams } from "../redux/booking";

export default function Promocode() {
  const params = useSelector(getParams);
  const dispatch = useDispatch();
  const [promo_code, setPromocode] = useState(params.promo_code.toUpperCase());

  useEffect(() => {
    dispatch(changeParams({ promo_code }));
  }, [promo_code, dispatch]);

  return (
    <Input
      type="text"
      label="Промокод"
      name="promocode"
      value={promo_code}
      onChange={({ target }) => setPromocode(target.value.toUpperCase())}
      style={{ marginBottom: "1rem" }}
    />
  );
}
