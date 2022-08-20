import React from 'react'
import { useSelector } from 'react-redux';
import { getPrimaryColor } from '../../redux/hotelConfig';
import { Payment } from './types';

export const PaymentSection = ({ payment }: { payment: Payment }) => {
    const color = useSelector(getPrimaryColor);
  
    return (
      <section
        style={{
          borderLeft: `4px solid ${color}`,
          paddingLeft: "0.5rem",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{new Date(payment.paid_time).toLocaleDateString()}</div>
  
          {payment.paid ? (
            <span className="tag is-success is-light">Оплачено</span>
          ) : (
            <a href={payment.payment_link}>
              <button className="button is-small is-warning">Оплатить</button>
            </a>
          )}
        </div>
        <h5 className="title is-6 mb-3">
          {payment.payment_type}{" "}
          <span className="subtitle is-6">{payment.payment_category}</span>
        </h5>
        <h5 className="is-5">{payment.amount} &#8381;</h5>
      </section>
    );
  };
  