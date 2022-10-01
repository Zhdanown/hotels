import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import React, { ReactNode, useState } from "react";
import { ButtonWithIcon } from "../components/Button";

import { Attachment } from "../Step3/AccompanyingGuests/AddedGuests";
import { ExtraGuest } from "../Step3/AccompanyingGuests/ExtraGuest";
import {
  GuestForm,
  GuestFormFields,
} from "../Step3/AccompanyingGuests/GuestForm";

type GuestFormType = {
  fields: GuestFormFields | null;
  attachments?: Attachment[];
};

export type Guest = {
  first_name: string;
  last_name: string;
  id: number;
  attachments: Attachment[];
};

export const GuestList = ({
  guests,
  children,
  renderItem,
}: {
  guests: Guest[];
  children?: ReactNode;
  renderItem?: (item: Guest, node: ReactNode) => ReactNode;
}) => {
  const [guestForm, setGuestForm] = useState<GuestFormType>({ fields: null });
  const [view, setView] = useState<"list" | "form">("list");

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

  const renderGuest = (guest: Guest) => (
    <ExtraGuest key={guest.id} guest={guest} editGuest={onEditGuest} />
  );

  const renderList = () => (
    <>
      <div className="has-text-centered">
        <ButtonWithIcon onClick={createGuest} Icon={PlusOutlined}>
          Добавить гостя
        </ButtonWithIcon>
      </div>
      {guests.map(
        guest => renderItem?.(guest, renderGuest(guest)) || renderGuest(guest)
      )}
      {children}
    </>
  );

  const views: { [P in "list" | "form"]: () => ReactNode } = {
    list: renderList,
    form: renderForm,
  };

  return <div>{views[view]()}</div>;
};
