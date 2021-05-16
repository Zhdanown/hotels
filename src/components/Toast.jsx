import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

export const Toast = () => <StyledToast autoClose={5000} />;

export const notify = message => toast(message);

const StyledToast = styled(ToastContainer)`
  .Toastify__toast {
    background: #333333;
  }

  .Toastify__close-button {
    color: white;
  }

  .Toastify__progress-bar--default {
    background: linear-gradient(to right, transparent, white);
  }
`;
