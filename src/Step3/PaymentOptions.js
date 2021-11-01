import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Centered } from "../components/Centered";
import Button from "../components/Button";
import HTMLParser from "../components/HTMLParser";
import { getPaymentOptions, getPaymentForm } from "../redux/hotelConfig";
import { submitOrder, getParams } from "../redux/booking";


const Option = styled.div`
  flex-grow: 1;

  &:last-child {
    margin-left: 1rem;
  }
`;

export default function PaymentOptions() {
  const options = useSelector(getPaymentOptions);
  const orderInfo = useSelector(getParams);

  const nights = orderInfo.rate.nights.length;

  const dispatch = useDispatch();

  const [selectedPayment, setPayment] = useState(null);

  const bookRoom = payment => dispatch(submitOrder(payment));

  const onOptionSelect = opt => {
    const payment = opt.is_not_pay ? null : opt;
    setPayment({ payment });
  };

  if (selectedPayment)
    return (
      <PaymentForm selectedPayment={selectedPayment} bookRoom={bookRoom} />
    );

  return (
    <>
      <h1 className="is-size-4">Варианты бронирования</h1>
      <div className="mt-3" style={{ display: "flex" }}>
        {
        options.map(option => (
          <>
          {
            nights==1 && option.payment_alias=='FIRST_NIGTH' ? (
              null
            ) : 
            <Option key={option.id}>
              <Button block onClick={() => onOptionSelect(option)}>
                {option.payment_type}
              </Button>
            </Option>
          }
          </>
        ))
        }
      </div>
    </>
  );
}

function PaymentForm({ selectedPayment: { payment }, bookRoom }) {
  const paymentForm = useSelector(getPaymentForm);

  useEffect(() => {
    if (!payment) bookRoom(payment);
  }, [payment, bookRoom]);

  if (!payment) return null;

  if (payment)
    return (
      <>
        <HTMLParser html={paymentForm.details} />
        <Centered>
          <Button onClick={() => bookRoom(payment)}>Перейти к оплате</Button>
        </Centered>
      </>
    );
}
