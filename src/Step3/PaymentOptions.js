import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import Button from "../components/Button";
import { getPaymentOptions, submitOrder } from "../reservation";

const Option = styled.div`
  flex-grow: 1;

  &:last-child {
    margin-left: 1rem;
  }
`;

export default function PaymentOptions() {
  const options = useSelector(getPaymentOptions);
  const dispatch = useDispatch();

  const onOptionSelect = opt => {
    const payment = opt.is_not_pay ? null : { percent: 100 };
    dispatch(submitOrder(payment));
  };

  return (
    <>
      <h1 className="is-size-4">Варианты бронирования</h1>
      <div className="mt-3" style={{ display: "flex" }}>
        {options.map(option => (
          <Option key={option.id}>
            <Button block onClick={() => onOptionSelect(option)}>
              {option.payment_type}
            </Button>
          </Option>
        ))}
      </div>
    </>
  );
}
