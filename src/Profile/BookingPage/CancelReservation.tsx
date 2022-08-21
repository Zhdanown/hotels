import React, { useState } from "react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

export const CancelReservation = ({
  cancelReservation,
  isCancelling,
}: {
  cancelReservation: () => void;
  isCancelling: boolean;
}) => {
  const [isModalOpen, toggleModal] = useState(false);

  const confirmBeforeCancelling = () => {
    toggleModal(true);
  };

  const cancelAndCloseModal = () => {
    cancelReservation();
    toggleModal(false);
  };

  return (
    <>
      <Button block onClick={confirmBeforeCancelling} loading={isCancelling}>
        Отменить бронирование
      </Button>
      <Modal open={isModalOpen} toggle={toggleModal}>
        <>
          <p className="title is-4">Внимание!</p>
          <p className="subtitle is-6">
            Это действие приведёт к отмене бронирования. Продолжить?
          </p>
          <div style={{ textAlign: "right" }}>
            <Button onClick={cancelAndCloseModal}>Продолжить</Button>
            <Button
              outline
              style={{ marginLeft: "1rem" }}
              onClick={() => toggleModal(false)}
            >
              Отмена
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
};
