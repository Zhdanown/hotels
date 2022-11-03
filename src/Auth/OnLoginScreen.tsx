import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button from "../components/Button";
import { Centered } from "../components/Centered";
import Overlay from "../components/Overlay";
import { getUser } from "./authReducer";
import { Greetings } from "./components";

const WarningMessage = styled.div`
  max-width: 750px;

  h3 {
    font-size: 40px;
  }
  p {
    font-size: 24px;
  }
  @media screen and (max-width: 800px) {
    max-width: 450px;
    h3 {
      font-size: 28px;
    }
    p {
      font-size: 16px;
    }
  }

  @media screen and (max-width: 500px) {
    max-width: 400px;
  }
  @media screen and (max-width: 410px) {
    max-width: 300px;
  }
`;

export const WarningForSberUser = ({ close }: { close: () => void }) => (
  <Centered column>
    <WarningMessage className="p-3">
      <h3 className="has-text-centered">Внимание!</h3>
      <p className="has-text-justified">
        После создания бронирования с Вами свяжется сотрудник СКК
      </p>
      <p className="has-text-justified">
        "МРИЯ" направляет письмо сотруднику (на почту, указанную при
        бронировании путевки) о необходимости подтвердить статус "Близкий член
        семьи сотрудника". Сотруднику необходимо предоставить копии документов,
        подтверждающих его родство с близкими членам семьи (свидетельство о
        заключении брака, свидетельство о рождении, свидетельство о перемене
        имени) в ответном письме
      </p>
    </WarningMessage>

    <Button className="mt-5" onClick={close}>
      Понятно
    </Button>
  </Centered>
);

export const OnLoginScreen = () => {
  const user = useSelector(getUser);
  const isSberEmployee = user?.teamID_info?.is_active;
  const [isWarningRead, markAsRead] = useState(false);

  const close = useCallback(() => markAsRead(true), []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (user && !isSberEmployee) {
      timeout = setTimeout(close, 1500);
    }
    return () => clearTimeout(timeout);
  }, [user, isSberEmployee, close]);

  if (isWarningRead) {
    return null;
  }

  if (isSberEmployee) {
    return (
      <Overlay>
        <WarningForSberUser close={close} />
      </Overlay>
    );
  }

  if (user) {
    return (
      <Overlay>
        <Greetings>
          С Возвращением, <br />
          {user.first_name}!
        </Greetings>
      </Overlay>
    );
  }
  return null;
};
