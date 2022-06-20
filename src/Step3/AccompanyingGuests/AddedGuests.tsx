import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../../Auth/authReducer";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { getParams } from "../../redux/booking";
import { GuestForm, GuestFormFields } from "./GuestForm";
import { ExtraGuest } from "./ExtraGuest";
import plural from "plural-ru";
import styled from "styled-components";

export type Attachment = {
  id: number;
  file: string;
  file_name: string;
  description: string;
  uploaded: string;
};

type Guest = {
  first_name: string;
  last_name: string;
  id: number;
  attachments: Attachment[];
};

type GuestForm = {
  fields: GuestFormFields | null;
  attachments?: Attachment[];
};

export type GuestOption = Guest & {
  checked: boolean;
};

export const AddedGuests = () => {
  const params = useSelector(getParams);
  const { user_guests: userGuests }: { user_guests: Guest[] } =
    useSelector(getUser) || {};

  const extraGuestsCount = getExtraGuestsCount(params);

  const [view, setView] = useState<"list" | "form">("list");

  const [isAddGuestOpen, toggleGuestScreen] = useState(false); // TEMP while in modal
  const [selectedGuests, setSelectedGuests] = useState<GuestOption[]>([]);
  const [guestForm, setGuestForm] = useState<GuestForm>({ fields: null });

  const confirmGuests = () => {
    console.log("Выбраны следующие гости", selectedGuests);
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

  const onEditGuest = (guest: GuestOption) => {
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
        <Button onClick={createGuest}>+ Добавить гостя</Button>
      </div>
      <GuestList
        guests={userGuests}
        guestCount={extraGuestsCount}
        onSelectionChange={selectedGuests => setSelectedGuests(selectedGuests)}
        onEditGuest={onEditGuest}
      />
      <div className="has-text-centered">
        <Button onClick={confirmGuests} disabled={!selectedGuests.length} block>
          Подтвердить состав гостей
        </Button>
      </div>
    </>
  );

  const renderForm = () =>
    guestForm.fields && (
      <>
        <Button onClick={() => setView("list")}>Назад</Button>

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

  if (!extraGuestsCount) {
    return null;
  }

  return (
    <>
      <Button onClick={() => toggleGuestScreen(true)} block>Выбрать сопровождающих гостей</Button>
      <Modal open={isAddGuestOpen} toggle={toggleGuestScreen}>
        <div>{views[view]()}</div>
      </Modal>
    </>
  );
};

const GuestList = ({
  guests,
  guestCount,
  onSelectionChange,
  onEditGuest,
}: {
  guests: Guest[];
  guestCount: number;
  onSelectionChange: (selectedGuests: GuestOption[]) => void;
  onEditGuest: (guest: GuestOption) => void;
}) => {
  const [guestList, setGuests] = useState<GuestOption[]>(
    guests?.map(g => ({ ...g, checked: false })) || []
  );

  useEffect(() => {
    setGuests(guests?.map(g => ({ ...g, checked: false })) || []);
  }, [guests]);

  const onSelectGuest = (checked: boolean, guest: Guest) => {
    const updatedGuests = guestList.map(g =>
      g.id === guest.id ? { ...g, checked } : g
    );

    if (guestCount < updatedGuests.filter(g => g.checked).length) {
      console.warn(`you can choose no more than ${guestCount} guests`);
      return;
    }

    setGuests(updatedGuests);
    onSelectionChange(updatedGuests.filter(x => x.checked));
  };

  const vacantPlaces = guestCount - guestList.filter(g => g.checked).length;

  return (
    <>
      {guestList.map(guest => (
        <ExtraGuest
          key={guest.id}
          guest={guest}
          onSelect={(checked: boolean) => onSelectGuest(checked, guest)}
          editGuest={onEditGuest}
          disabled={!vacantPlaces ? !guest.checked : false}
        />
      ))}
      <LimitWarning>
        {vacantPlaces
          ? `Осталось выбрать ${vacantPlaces} ${plural(
              vacantPlaces,
              "гостя",
              "гостей",
              "гостей"
            )}`
          : "Все гости выбраны"}
      </LimitWarning>
    </>
  );
};

function getExtraGuestsCount(params: any) {
  const { adults, childs } = params;
  const childrenCount = childs.reduce(
    (totalCount: number, { count }: { count?: number }) =>
      totalCount + (count || 0),
    0
  );
  return adults + childrenCount - 1;
}

const LimitWarning = styled.p<{ visible?: boolean }>`
  transition: opacity 0.4s;
  margin-bottom: 1rem;
  text-align: center;
`;
