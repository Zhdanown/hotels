import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button from "../../components/Button";
import { getPrimaryColor } from "../../redux/hotelConfig";

type ChipProps = {
  fileName: string;
  onDelete?: () => void;
  disabled?: boolean;
};

export const AttachmentChip = ({ fileName, onDelete, disabled }: ChipProps) => {
  const primaryColor = useSelector(getPrimaryColor);

  return (
    <ChipContainer disabled={disabled}>
      <FileName color={primaryColor}>{fileName}</FileName>
      {onDelete && (
        <Button
          small
          style={{ marginLeft: "1rem" }}
          onClick={() => !disabled && onDelete()}
        >
          Заменить файл
        </Button>
      )}
    </ChipContainer>
  );
};

const ChipContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  opacity: ${p => (p.disabled ? 0.25 : 1)};
`;

const FileName = styled.div<{ color: string }>`
  margin: 10px 0;
  padding: 4px 6px;
  border-radius: 3px;
  border: 1px solid ${p => p.color};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
`;
