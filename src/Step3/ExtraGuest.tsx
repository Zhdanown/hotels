import React from "react";
import styled from "styled-components";
import Checkbox from "../components/Checkbox";
import { mediumMobileWidth } from "../Layout/MediaQueries";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import Button from "../components/Button";
import { GuestOption } from "./AddedGuests";

type ExtraGuestProps = {
  onSelect?: (selected: boolean) => void;
  editGuest: (guest: GuestOption) => void;
  guest: GuestOption;
};

export const ExtraGuest = ({ guest, onSelect, editGuest }: ExtraGuestProps) => {
  const { first_name, last_name, checked, attachments } = guest;
  const label = `${first_name} ${last_name}`;
  return (
    <StyledService>
      <HeaderSection>
        <Checkbox label={label} value={checked} onChange={onSelect} />
        <Button small onClick={() => editGuest(guest)}>
          <EditOutlined />
          Редактировать
        </Button>
      </HeaderSection>
      <>
        {attachments.map(attachment => (
          <div
            key={attachment.id}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                margin: "10px 0",
                padding: "4px 6px",
                borderRadius: 3,
                border: "1px solid green",
                fontSize: ".875rem",
              }}
            >
              <span>{attachment.file_name}</span>
            </div>
            <CloseOutlined
              style={{ fontSize: "1.5rem", marginLeft: "1rem" }}
              onClick={() => console.log(attachment)}
            />
          </div>
        ))}
      </>
    </StyledService>
  );
};
const StyledService = styled.article`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #ccc;

  @media (max-width: ${mediumMobileWidth}) {
    padding: 1rem 0.75rem;
  }
`;

const HeaderSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-weight: bold;
  margin-bottom: 0.5rem;

  h5 {
    font-weight: bold;
  }

  span {
    white-space: nowrap;
  }

  label {
    margin-right: 1rem;
  }
`;
