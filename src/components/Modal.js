import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const ModalContent = styled.div`
  max-width: 640px;
  width: calc(100% - 2rem);
`;

function Modal({ children, open, toggle }) {
  const modalContainer = useRef(document.createElement("div"));

  useEffect(() => {
    const modal = modalContainer.current;
    const body = document.querySelector("body");
    body.appendChild(modal);
    const handleEsc = e => {
      if (e.code === "Escape") {
        console.log("escape");
        toggle(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      body.removeChild(modal);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return createPortal(
    <Modal1 open={open} toggle={toggle}>
      {children}
    </Modal1>,
    modalContainer.current
  );
}

export default Modal;

function Modal1({ children, open, toggle }) {
  if (!open) return null;

  return (
    <div className={"modal" + (open ? " is-active" : "")}>
      <div className="modal-background"></div>
      <ModalContent className="modal-content">
        <div className="box">{children}</div>
      </ModalContent>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={() => toggle(false)}
      ></button>
    </div>
  );
}
