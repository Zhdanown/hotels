import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIsSberEmploye, getUser } from "../../Auth/authReducer";
import Button, { ButtonWithIcon } from "../../components/Button";
import Modal from "../../components/Modal";
import { changeParams, getParams } from "../../redux/booking";
import plural from "plural-ru";
import styled from "styled-components";
import { CheckOutlined } from "@ant-design/icons";
import { Guest, GuestList } from "../../Profile/GuestList";
import Checkbox from "../../components/Checkbox";
import useWindowWidth from "../../Layout/hooks/useWindowWidth";

export type Attachment = {
  id: number;
  file: string;
  file_name: string;
  description: string;
  uploaded: string;
};

export const AddedGuests = () => {
  const params = useSelector(getParams);
  const isSberEmploye = useSelector(getIsSberEmploye);
  const extraGuestsCount = getTotalGuestsCount(params);
  const [isAddGuestOpen, toggleGuestScreen] = useState(false); // TEMP while in modal

  if (!extraGuestsCount || !isSberEmploye) {
    return null;
  }

  return (
    <>
      <Button onClick={() => toggleGuestScreen(true)} block>
        Выбрать состав гостей
      </Button>
      <Modal open={isAddGuestOpen} toggle={toggleGuestScreen}>
        <ListOfGuests toggleGuestScreen={toggleGuestScreen} />
      </Modal>
    </>
  );
};

const ListOfGuests = ({
  toggleGuestScreen,
}: {
  toggleGuestScreen: (v: boolean) => void;
}) => {
  const params = useSelector(getParams);
  const extraGuestsCount = getTotalGuestsCount(params);

  const { user_guests: userGuests }: { user_guests: Guest[] } =
    useSelector(getUser) || {};

  const reservationParams = useSelector(getParams);

  const [selectedGuests, setSelectedGuests] = useState<number[]>(
    reservationParams.guests || []
  );

  useEffect(() => {
    setSelectedGuests(reservationParams.guests || []);
  }, [reservationParams.guests]);

  const dispatch = useDispatch();

  const confirmGuests = () => {
    dispatch(changeParams({ guests: selectedGuests }));
    toggleGuestScreen(false);
  };

  const onSelectGuest = (checked: boolean, guest: Guest) => {
    const newSelected = checked
      ? [...selectedGuests, guest.id]
      : selectedGuests.filter(x => x !== guest.id);

    if (extraGuestsCount < newSelected.length) {
      console.warn(`you can choose no more than ${extraGuestsCount} guests`);
      return;
    }

    setSelectedGuests(newSelected);
  };

  const vacantPlaces = extraGuestsCount - selectedGuests.length;
  const renderConfirmButton = () => (
    <>
      <LimitWarning>
        {vacantPlaces
          ? `Осталось выбрать ${vacantPlaces} ${plural(
              vacantPlaces,
              "гостя",
              "гостя",
              "гостей"
            )}`
          : "Все гости выбраны"}
      </LimitWarning>
      <div className="has-text-centered">
        <ButtonWithIcon
          Icon={CheckOutlined}
          onClick={confirmGuests}
          disabled={!selectedGuests.length}
          block
        >
          Подтвердить состав гостей
        </ButtonWithIcon>
      </div>
    </>
  );

  return (
    <SelectableGuestList
      guests={userGuests}
      selectedGuests={selectedGuests}
      renderConfirmButton={renderConfirmButton}
      onSelectGuest={onSelectGuest}
    />
  );
};

export const SelectableGuestList = ({
  guests,
  selectedGuests,
  renderConfirmButton,
  onSelectGuest,
}: {
  guests: Guest[];
  selectedGuests: number[];
  renderConfirmButton: () => ReactNode;
  onSelectGuest: (selected: boolean, guest: Guest) => void;
}) => {
  return (
    <>
      <GuestList
        guests={guests}
        renderItem={(guest, item) => (
          <SelectableGuest key={guest.id}>
            <CheckboxContainer>
              <Checkbox
                value={selectedGuests.includes(guest.id)}
                label=""
                disabled={false}
                onChange={(selected: boolean) => onSelectGuest(selected, guest)}
              />
            </CheckboxContainer>
            <div style={{ flex: 1 }}>{item}</div>
          </SelectableGuest>
        )}
      >
        {renderConfirmButton()}
      </GuestList>
    </>
  );
};

const CheckboxContainer = styled.div`
  margin-top: 18px;
`;

function getTotalGuestsCount(params: any) {
  const { adults, childs } = params;
  const childrenCount = childs.reduce(
    (totalCount: number, { count }: { count?: number }) =>
      totalCount + (count || 0),
    0
  );
  return adults + childrenCount;
}

const LimitWarning = styled.p<{ visible?: boolean }>`
  transition: opacity 0.4s;
  margin-bottom: 1rem;
  text-align: center;
`;

const SelectableGuest = styled.div`
  display: flex;
  align-items: start;

  cursor: pointer;
`;
