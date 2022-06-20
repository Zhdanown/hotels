import React from "react";
import styled from "styled-components";
import Checkbox from "../../components/Checkbox";
import { mediumMobileWidth } from "../../Layout/MediaQueries";
import { EditOutlined } from "@ant-design/icons";
import { ButtonWithIcon } from "../../components/Button";
import { Guest } from "./AddedGuests";
import { AttachmentChip } from "./Attachment";

type ExtraGuestProps = {
  guest: Guest;
  onSelect?: (selected: boolean) => void;
  selected?: boolean;
  disabled: boolean;
  editGuest: (guest: Guest) => void;
};

export const ExtraGuest = ({
  guest,
  selected,
  onSelect,
  disabled,
  editGuest,
}: ExtraGuestProps) => {
  const { first_name, last_name, attachments } = guest;
  const label = `${first_name} ${last_name}`;
  return (
    <StyledService>
      <HeaderSection>
        <Checkbox
          label={label}
          value={selected}
          disabled={disabled}
          onChange={onSelect}
        />
        <ButtonWithIcon
          Icon={EditOutlined}
          small
          onClick={() => editGuest(guest)}
          disabled={disabled}
        >
          Редактировать
        </ButtonWithIcon>
      </HeaderSection>
      <>
        {attachments.map(attachment => (
          <AttachmentChip
            key={attachment.id}
            fileName={attachment.file_name}
            disabled={disabled}
          />
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
