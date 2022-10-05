import React, { ReactNode } from "react";
import styled from "styled-components";
import { mediumMobileWidth } from "../../Layout/MediaQueries";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ButtonWithIcon } from "../../components/Button";
import { AttachmentChip } from "./Attachment";
import AntIcon from "@ant-design/icons";
import { Guest } from "../../Profile/GuestList";
import useWindowWidth from "../../Layout/hooks/useWindowWidth";

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

const HeaderSection = styled.section<{ isCompact: boolean }>`
  display: flex;
  flex-direction: ${p => (p.isCompact ? "column" : "row")};
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

const Buttons = styled.div`
  display: flex;
  button:not(:last-of-type) {
    margin-right: 0.5rem;
  }
`;

const ActionButton = ({
  onClick,
  Icon,
  children,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  Icon: typeof AntIcon;
  disabled?: boolean;
}) => (
  <ButtonWithIcon Icon={Icon} small onClick={onClick} disabled={disabled}>
    {children}
  </ButtonWithIcon>
);

type ExtraGuestProps = {
  guest: Guest;
  disabled?: boolean;
  editGuest: (guest: Guest) => void;
  deleteGuest: (guest: Guest) => void;
};

export const ExtraGuest = ({
  guest,
  disabled,
  editGuest,
  deleteGuest,
}: ExtraGuestProps) => {
  const { first_name, last_name, attachments } = guest;
  const label = `${first_name} ${last_name}`;

  const [width] = useWindowWidth();
  const isCompact = width ? width < 640 : false;
  const hideButtonCaptions = width ? width < 400 : false;

  return (
    <StyledService>
      <HeaderSection isCompact={isCompact}>
        <div>{label}</div>
        <Buttons>
          <ActionButton
            onClick={() => editGuest(guest)}
            Icon={EditOutlined}
            disabled={disabled}
          >
            {!hideButtonCaptions && <span>Редактировать</span>}
          </ActionButton>
          <ActionButton
            onClick={() => deleteGuest(guest)}
            Icon={DeleteOutlined}
            disabled={disabled}
          >
            {!hideButtonCaptions && <span>Удалить</span>}
          </ActionButton>
        </Buttons>
      </HeaderSection>
      <>
        {attachments.map(attachment => (
          <AttachmentChip
            key={attachment.id}
            fileName={attachment.file_name}
            url={attachment.file}
            disabled={disabled}
          />
        ))}
      </>
    </StyledService>
  );
};
