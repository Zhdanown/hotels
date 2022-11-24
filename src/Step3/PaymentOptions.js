import React, { Fragment } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Centered } from "../components/Centered";
import Button from "../components/Button";
import HTMLParser from "../components/HTMLParser";
import { getPaymentOptions, getPaymentForm } from "../redux/hotelConfig";
import { submitOrder, getParams } from "../redux/booking";
import { useNightsAdjustedForRooms } from "../utils/useNights";

const Option = styled.div`
  flex-grow: 1;

  &:last-child {
    margin-left: 1rem;
  }
`;

export default function PaymentOptions() {
  const options = useSelector(getPaymentOptions);
  const paymentForm = useSelector(getPaymentForm);
  const orderInfo = useSelector(getParams);
  const nights = useNightsAdjustedForRooms(orderInfo.rate?.nights.length);

  const dispatch = useDispatch();

  const bookRoom = opt => {
    const payment = opt.is_not_pay ? null : opt;
    dispatch(submitOrder(payment));
  };

  return (
    <>
      <HTMLParser html={paymentForm.details} />
      <h1 className="is-size-4 mb-3">Варианты оплаты</h1>
      <Centered>
        {options.map(option => (
          <Fragment key={option.id}>
            {nights === 1 && option.payment_alias === "FIRST_NIGTH" ? null : (
              <Option key={option.id}>
                <Button block onClick={() => bookRoom(option)}>
                  {option.payment_type}
                </Button>
              </Option>
            )}
          </Fragment>
        ))}
      </Centered>
    </>
  );
}
