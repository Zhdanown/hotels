import React, { useCallback, useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import {
  getBookingState,
  getBookingResponse,
  getParams,
} from "../redux/booking";
import { getRulesAndServicesFileReference } from "../redux/hotelConfig";
import { changeParams } from "../redux/booking";
import FormNewGuest from "./FormNewGuest";
import FormNoRegistration from "./FormNoRegistration";
import PaymentOptions from "./PaymentOptions";
import Tabs from "../components/Tabs";
import Link from "../components/Link";
import Modal from "../components/Modal";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import LayoutContext from "../Layout/LayoutContext";
import { Centered } from "../components/Centered";
import Input from "../components/Input";
import OrderSummary from "./OrderSummary";
import { getUser } from "../Auth/authReducer";

const forms = [
  {
    id: "new-guest",
    label: "Новый гость",
    render: props => <FormNewGuest {...props} />,
  },
  {
    id: "no-registration",
    label: "Без регистрации",
    render: props => <FormNoRegistration {...props} />,
  },
];

const Conditions = styled(Centered)`
  margin: 1rem 0;
`;

function Confirm() {
  const dispatch = useDispatch();
  const isBooking = useSelector(getBookingState);
  const bookingResponse = useSelector(getBookingResponse);
  const rulesAndServicesFile = useSelector(getRulesAndServicesFileReference);
  const user = useSelector(getUser);

  const [modal, setModal] = useState(false);
  const [consent, setConsent] = useState(false);

  const [guest, setGuest] = useState({
    username: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone: "",
    date_of_birth: null,
    is_hotel_guest: true,
    password: "",
    password_confirm: "",
  });

  const onGuestChange = useCallback(({ target }) => {
    setGuest(user => ({
      ...user,
      [target.name]: target.value,
    }));
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    dispatch(changeParams({ guest }));
    setModal(true);
  };

  useEffect(() => {
    if (bookingResponse) {
      setModal(false);
    }
  }, [bookingResponse]);

  const { setStep } = useContext(LayoutContext);

  const goBack = () => {
    setStep(step => --step);
  };

  if (isBooking) {
    return <h4>Идёт обработка заказа...</h4>;
  } else if (bookingResponse) {
    return <h4>Выполняется переадресация...</h4>;
  } else {
    return (
      <div>
        <ColumnHeader goBack={goBack}>Оплата</ColumnHeader>

        {!user && (
          <Tabs
            tabs={forms}
            preSelected={0}
            guest={guest}
            onSubmit={onSubmit}
            onGuestChange={onGuestChange}
          />
        )}

        <CommentField />
        <OrderSummary />

        <Conditions column>
          <Link href={rulesAndServicesFile} target="_blank" underlined>
            Правила и услуги
          </Link>
        </Conditions>

        <label className="checkbox">
          <input
            type="checkbox"
            name="consent"
            id="consent"
            value={consent}
            onChange={() => setConsent(x => !x)}
            style={{ marginRight: ".5rem" }}
          />
          Я подтверждаю своё согласие с{" "}
          <Link>Политикой в отношении обработки персональных данныx</Link>
        </label>

        <Button block onClick={onSubmit} disabled={!consent}>
          {consent ? "Продолжить" : "Необходимо согласие"}
        </Button>

        <Modal open={modal} toggle={setModal}>
          <PaymentOptions />
        </Modal>
      </div>
    );
  }
}

export default Confirm;

function CommentField() {
  const params = useSelector(getParams);
  const [comment, setComment] = useState(params.comment);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeParams({ comment }));
  }, [comment, dispatch]);

  return (
    <Input
      type="textarea"
      label="Комментарий к заказу"
      name="comment"
      value={comment}
      onChange={({ target }) => setComment(target.value)}
      style={{ marginTop: "2rem" }}
    />
  );
}
