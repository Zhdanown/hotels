import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button from "../../components/Button";
import { getPrimaryColor } from "../../redux/hotelConfig";

type ChipProps = {
  fileName: string;
  onDelete?: () => void;
  disabled?: boolean;
} & ({ url?: never; file: File } | { url: string; file?: never });

export const AttachmentChip = ({
  fileName,
  url,
  file,
  onDelete,
  disabled,
}: ChipProps) => {
  const primaryColor = useSelector(getPrimaryColor);

  const openFile = () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = function (e) {
      const img = new Image();
      img.src = e.target?.result as string;
      const newWindow = window.open("", "_blank");
      newWindow?.document.write(img.outerHTML);
      newWindow?.document.close();
    };
    reader.readAsDataURL(file);
  };

  return (
    <ChipContainer disabled={disabled}>
      <FileName color={primaryColor} href={url} target="_blank" onClick={openFile}>
        {fileName}
      </FileName>
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

const FileName = styled.a<{ color: string }>`
  margin: 10px 0;
  padding: 4px 6px;
  color: ${p => p.color};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
`;
