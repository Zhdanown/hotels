import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import {
  getBookingState,
  getBookingResponse,
  getParams,
} from "../redux/booking";
import {
  getIsBookingAllowed,
  getRulesAndServicesFileReference,
  getUsersTerms,
} from "../redux/hotelConfig";
import { changeParams } from "../redux/booking";
import FormNoRegistration from "./FormNoRegistration";
import PaymentOptions from "./PaymentOptions";
import Link from "../components/Link";
import Modal from "../components/Modal";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import LayoutContext from "../Layout/LayoutContext";
import { Centered } from "../components/Centered";
import Input from "../components/Input";
import OrderSummary from "./OrderSummary";
import { getIsSberEmploye, getUser } from "../Auth/authReducer";
import { AuthLink } from "../Auth/components";
import { AddedGuests } from "./AccompanyingGuests/AddedGuests";
import SberForm from "./SberForm";
import Overlay from "../components/Overlay";
import { WarningForSberUser } from "../Auth/OnLoginScreen";
import { createPortal } from "react-dom";

const Conditions = styled(Centered)`
  margin: 1rem 0;
`;

function useIsSberFormValid() {
  const params = useSelector(getParams);

  const { email, phone } = params.guest;
  return email && phone;
}

function ConfirmScreen() {
  const isBooking = useSelector(getBookingState);
  const bookingResponse = useSelector(getBookingResponse);
  const rulesAndServicesFile = useSelector(getRulesAndServicesFileReference);
  const user = useSelector(getUser);

  const isSberEmploye = useSelector(getIsSberEmploye);

  const [modal, setModal] = useState(false);
  const [disclaimerScreen, setDisclaimerScreen] = useState(false);

  const [guest] = useState({
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

  const onSubmit = () => {
    setDisclaimerScreen(true);
  };

  const onStupidModalClose = () => {
    setDisclaimerScreen(false);
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

  if (disclaimerScreen) {
    return createPortal(
      <Overlay>
        <WarningForSberUser close={onStupidModalClose} />
      </Overlay>,
      document.querySelector("body")
    );
  }

  if (isBooking) {
    return <h4>Идёт обработка заказа...</h4>;
  } else if (bookingResponse) {
    return <h4>Выполняется переадресация...</h4>;
  } else {
    return (
      <div>
        <ColumnHeader goBack={goBack}>Оплата</ColumnHeader>
        <OrderSummary />

        {isSberEmploye && <SberForm guest={guest} onSubmit={onSubmit} />}

        {!user && (
          <>
            <label htmlFor="">Забронировать без регистрации</label>
            <FormNoRegistration guest={guest} onSubmit={onSubmit} />
            {/* <div>
              <label htmlFor="">Или</label>
              <AuthLink style={{ marginTop: 0 }} to="/register">
                зарегистрироваться
              </AuthLink>
            </div> */}
          </>
        )}

        <CommentField />

        <div style={{ marginTop: 20 }}>
          <AddedGuests />
        </div>

        <Conditions column>
          <Link href={rulesAndServicesFile} target="_blank" underlined>
            Правила и услуги
          </Link>
        </Conditions>

        <ConfirmReservationButton
          user={user}
          onSubmit={onSubmit}
          isSberEmploye={isSberEmploye}
        />

        <Modal open={modal} toggle={setModal}>
          <PaymentOptions />
        </Modal>
      </div>
    );
  }
}

export default ConfirmScreen;

const ConfirmReservationButton = ({ user, onSubmit, isSberEmploye }) => {
  const [consent, setConsent] = useState(false);
  const isBookingAllowed = useSelector(getIsBookingAllowed);
  const isSberFormValid = useIsSberFormValid();
  const userTermsFile = useSelector(getUsersTerms);

  /** скрывать кнопку блокирования во время тестирования */
  if (!isBookingAllowed) {
    return null;
  }

  return (
    <>
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
        <Link href={userTermsFile} target="_blank">
          Политикой в отношении обработки персональных данныx
        </Link>
      </label>

      <SubmitButton
        user={user}
        disabled={!consent || (isSberEmploye && !isSberFormValid)}
        onSubmit={onSubmit}
        style={{ marginBottom: "1rem" }}
      >
        {consent ? "Продолжить" : "Необходимо согласие"}
      </SubmitButton>
    </>
  );
};

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
      label="Укажите ФИО гостей"
      name="comment"
      value={comment}
      onChange={({ target }) => setComment(target.value)}
      style={{ marginTop: "2rem" }}
    />
  );
}

function SubmitButton({ user, children, onSubmit, disabled, style }) {
  return !user ? (
    <Button
      block
      disabled={disabled}
      style={style}
      type="submit"
      form="no-registration"
    >
      {children}
    </Button>
  ) : (
    <Button block disabled={disabled} onClick={onSubmit} style={style}>
      {children}
    </Button>
  );
}
