import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import React, { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button, { ButtonWithIcon } from "../components/Button";
import Loader, { LoaderWrapper } from "../components/Loader";
import Modal from "../components/Modal";

import { Attachment } from "../Step3/AccompanyingGuests/AddedGuests";
import {
  deleteExtraGuest,
  getIsDeleteGuestPending,
} from "../Step3/AccompanyingGuests/AddedGuests.saga";
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
  const dispatch = useDispatch();
  const isDeleting = useSelector(getIsDeleteGuestPending);
  const [itemToDelete, setToDelete] = useState<Guest | null>(null);

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

  const confirmGuestDeletion = (guest: Guest) => {
    setToDelete(guest);
  };

  const deleteGuest = () => {
    itemToDelete && dispatch(deleteExtraGuest(itemToDelete?.id));
    setToDelete(null);
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
    <ExtraGuest
      key={guest.id}
      guest={guest}
      editGuest={onEditGuest}
      deleteGuest={confirmGuestDeletion}
    />
  );

  const renderList = () => (
    <>
      <div className="has-text-centered">
        <ButtonWithIcon onClick={createGuest} Icon={PlusOutlined}>
          Добавить гостя
        </ButtonWithIcon>
      </div>
      {guests?.map(
        guest => renderItem?.(guest, renderGuest(guest)) || renderGuest(guest)
      )}
      {children}
    </>
  );

  const views: { [P in "list" | "form"]: () => ReactNode } = {
    list: renderList,
    form: renderForm,
  };

  if (isDeleting) {
    return (
      <LoaderWrapper style={{ width: "100%", marginTop: "2rem" }}>
        <Loader />
      </LoaderWrapper>
    );
  }

  return (
    <>
      <div>{views[view]()}</div>
      <Modal open={itemToDelete} toggle={() => setToDelete(null)}>
        <h3 className="is-size-4">Вы действительно хотите удалить гостя?</h3>
        <section className="mt-5 mb-5">
          <p>
            {itemToDelete?.first_name} {itemToDelete?.last_name}
          </p>
        </section>
        <section style={{ textAlign: "right" }}>
          <Button
            outline
            style={{ marginRight: "1rem" }}
            onClick={() => setToDelete(null)}
          >
            Отмена
          </Button>
          <Button onClick={deleteGuest}>Удалить</Button>
        </section>
      </Modal>
    </>
  );
};
