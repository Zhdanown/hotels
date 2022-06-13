import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../Auth/authReducer";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { getParams } from "../redux/booking";
import { GuestForm, GuestFormFields } from "./AccompanyingGuests/GuestForm";
import { ExtraGuest } from "./ExtraGuest";

type Guest = {
  first_name: string;
  last_name: string;
  id: string;
  attachments: {
    id: number;
    file: string;
    file_name: string;
    description: string;
    uploaded: string;
  }[];
};

export type GuestOption = Guest & {
  checked: boolean;
};

export const AddedGuests = () => {
  const params = useSelector(getParams);
  const { user_guests: userGuests }: { user_guests: Guest[] } =
    useSelector(getUser) || {};

  const extraGuestsCount = getExtraGuestsCount(params);

  const [isAddGuestOpen, toggleGuestScreen] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<GuestOption[]>([]);
  const [guestForm, setGuestForm] = useState<GuestFormFields | null>(null);

  if (!extraGuestsCount) {
    return null;
  }

  const confirmGuests = () => {
    console.log("Выбраны следующие гости", selectedGuests);
  };

  const createGuest = () => {
    setGuestForm({
      id: null,
      first_name: "",
      last_name: "",
      files: null,
      description: "",
    });
  };

  const onEditGuest = (guest: GuestOption) => {
    const {first_name, last_name, id, attachments} = guest
    setGuestForm({
      id: Number(id),
      first_name,
      last_name,
      files: null, // TODO ??
      description: "", // TODO ??
    });
  }

  return (
    <>
      <Button onClick={() => toggleGuestScreen(true)}>Добавить гостя</Button>
      <Modal open={isAddGuestOpen} toggle={toggleGuestScreen}>
        <div>
          <Button onClick={createGuest}>+ Добавить гостя</Button>

          {guestForm && <GuestForm initialValues={guestForm} />}

          <GuestList
            guests={userGuests}
            guestCount={extraGuestsCount}
            onSelectionChange={selectedGuests =>
              setSelectedGuests(selectedGuests)
            }
            onEditGuest={onEditGuest}
          />

          <Button onClick={confirmGuests}>Подтвердить состав гостей</Button>
        </div>
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
      console.log(`you can choose no more than ${guestCount} guests`);
      return;
    }

    setGuests(updatedGuests);
    onSelectionChange(updatedGuests.filter(x => x.checked));
  };

  return (
    <>
      {guestList.map(guest => (
        <ExtraGuest
          key={guest.id}
          guest={guest}
          onSelect={(checked: boolean) => onSelectGuest(checked, guest)}
          editGuest={onEditGuest}
        />
      ))}
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
