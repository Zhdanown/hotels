import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIsSberEmploye, getUser } from "../../Auth/authReducer";
import Button, { ButtonWithIcon } from "../../components/Button";
import Modal from "../../components/Modal";
import { changeParams, getParams } from "../../redux/booking";
import { GuestForm, GuestFormFields } from "./GuestForm";
import { ExtraGuest } from "./ExtraGuest";
import plural from "plural-ru";
import styled from "styled-components";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  PlusOutlined,
} from "@ant-design/icons";

export type Attachment = {
  id: number;
  file: string;
  file_name: string;
  description: string;
  uploaded: string;
};

export type Guest = {
  first_name: string;
  last_name: string;
  id: number;
  attachments: Attachment[];
};

type GuestFormType = {
  fields: GuestFormFields | null;
  attachments?: Attachment[];
};

export const AddedGuests = () => {
  const params = useSelector(getParams);
  const { user_guests: userGuests }: { user_guests: Guest[] } =
    useSelector(getUser) || {};
  const isSberEmploye = useSelector(getIsSberEmploye);
  const reservationParams = useSelector(getParams);

  const extraGuestsCount = getTotalGuestsCount(params);

  const [isAddGuestOpen, toggleGuestScreen] = useState(false); // TEMP while in modal
  const [selectedGuests, setSelectedGuests] = useState<number[]>(
    reservationParams.guests || []
  );
  const [view, setView] = useState<"list" | "form">("list");
  const [guestForm, setGuestForm] = useState<GuestFormType>({ fields: null });

  useEffect(() => {
    setSelectedGuests(reservationParams.guests || []);
  }, [reservationParams.guests]);

  const dispatch = useDispatch();

  const confirmGuests = () => {
    dispatch(changeParams({ guests: selectedGuests }));
    toggleGuestScreen(false);
  };

  const createGuest = () => {
    setGuestForm({
      fields: {
        id: null,
        first_name: "",
        last_name: "",
        files: null,
      },
    });

    setView("form");
  };

  const onEditGuest = (guest: Guest) => {
    const { first_name, last_name, id, attachments } = guest;

    setGuestForm({
      fields: {
        id: Number(id),
        first_name,
        last_name,
        files: null,
        attachment: attachments?.[0],
      },
    });

    setView("form");
  };

  const renderList = () => (
    <>
      <div className="has-text-centered">
        <ButtonWithIcon onClick={createGuest} Icon={PlusOutlined}>
          Добавить гостя
        </ButtonWithIcon>
      </div>
      <GuestList
        guests={userGuests}
        guestCount={extraGuestsCount}
        selectedGuests={selectedGuests}
        onSelectionChange={selectedGuests => setSelectedGuests(selectedGuests)}
        onEditGuest={onEditGuest}
      />
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

  const renderForm = () =>
    guestForm.fields && (
      <>
        <ButtonWithIcon
          Icon={ArrowLeftOutlined}
          onClick={() => setView("list")}
        >
          Назад
        </ButtonWithIcon>

        <GuestForm
          initialValues={guestForm.fields}
          goBack={() => setView("list")}
        />
      </>
    );

  const views: { [P in "list" | "form"]: () => ReactNode } = {
    list: renderList,
    form: renderForm,
  };

  if (!extraGuestsCount || !isSberEmploye) {
    return null;
  }

  return (
    <>
      <Button onClick={() => toggleGuestScreen(true)} block>
        Выбрать состав гостей
      </Button>
      <Modal open={isAddGuestOpen} toggle={toggleGuestScreen}>
        <div>{views[view]()}</div>
      </Modal>
    </>
  );
};

const GuestList = ({
  guests,
  guestCount,
  selectedGuests,
  onSelectionChange,
  onEditGuest,
}: {
  guests: Guest[];
  guestCount: number;
  selectedGuests: number[];
  onSelectionChange: (selectedGuests: number[]) => void;
  onEditGuest: (guest: Guest) => void;
}) => {
  const onSelectGuest = (checked: boolean, guest: Guest) => {
    const newSelected = checked
      ? [...selectedGuests, guest.id]
      : selectedGuests.filter(x => x !== guest.id);

    if (guestCount < newSelected.length) {
      console.warn(`you can choose no more than ${guestCount} guests`);
      return;
    }

    onSelectionChange(newSelected);
  };

  const vacantPlaces = guestCount - selectedGuests.length;

  return (
    <>
      {guests.map(guest => (
        <ExtraGuest
          key={guest.id}
          guest={guest}
          selected={selectedGuests.includes(guest.id)}
          onSelect={(checked: boolean) => onSelectGuest(checked, guest)}
          editGuest={onEditGuest}
          disabled={!vacantPlaces ? !selectedGuests.includes(guest.id) : false}
        />
      ))}
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
    </>
  );
};

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
