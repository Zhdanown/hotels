import React from "react";
import styled from "styled-components";
import Checkbox from "../../components/Checkbox";
import { mediumMobileWidth } from "../../Layout/MediaQueries";
import { EditOutlined } from "@ant-design/icons";
import Button from "../../components/Button";
import { GuestOption } from "./AddedGuests";
import { AttachmentChip } from "./Attachment";

type ExtraGuestProps = {
  guest: GuestOption;
  onSelect?: (selected: boolean) => void;
  disabled: boolean;
  editGuest: (guest: GuestOption) => void;
};

export const ExtraGuest = ({ guest, onSelect, disabled, editGuest }: ExtraGuestProps) => {
  const { first_name, last_name, checked, attachments } = guest;
  const label = `${first_name} ${last_name}`;
  return (
    <StyledService>
      <HeaderSection>
        <Checkbox label={label} value={checked} disabled={disabled} onChange={onSelect} />
        <Button small onClick={() => editGuest(guest)} disabled={disabled}>
          <EditOutlined />
          Редактировать
        </Button>
      </HeaderSection>
      <>
        {attachments.map(attachment => (
          <AttachmentChip key={attachment.id} fileName={attachment.file_name} disabled={disabled}/>
        ))}
      </>
    </StyledService>
  );
};

const StyledService = styled.article`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #ccc;
  
  &:last-of-type {
    border-bottom: none;
  }

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
