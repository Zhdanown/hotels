import { CloseOutlined } from "@ant-design/icons";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getUser } from "../Auth/authReducer";
import { SberIcon } from "../components/CustomIcons";
import { Guest } from "../Step3/AccompanyingGuests/AddedGuests";
import { AttachmentChip } from "../Step3/AccompanyingGuests/Attachment";

export const ProfileTab = () => {
  const user = useSelector(getUser);

  const {
    last_name,
    first_name,
    middle_name,
    email,
    phone,
    user_guests,
    sber_info,
  } = user || {};

  return (
    <>
      {/* <View> */}
      <p className="title is-4">{`${last_name} ${first_name} ${middle_name}`}</p>
      {sber_info?.department && (
        <div
          className="mt-4 mb-4"
          style={{ display: "flex", alignItems: "center" }}
        >
          <SberIcon style={{ marginRight: 8 }} />
          <p>{sber_info.department}</p>
        </div>
      )}

      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            type="email"
            placeholder="Text input"
            value={email}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Телефон</label>
        <div className="control">
          <input
            className="input"
            type="email"
            placeholder="Text input"
            value={phone}
          />
        </div>
      </div>

      <div className="mt-5 mb-5">
        <h4 className="title is-5 mb-2">Добавленные ранее гости</h4>
        <GuestList guests={user_guests} />
      </div>
    </>
    // </View>
  );
};

export const GuestList = ({ guests }: { guests: Guest[] }) => {
  return (
    <table className="table is-striped is-fullwidth">
      <tbody>
        {guests?.map(guest => (
          <tr key={guest.id}>
            <td>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {guest.first_name} {guest.last_name}
                  </span>
                  {/* <CloseOutlined /> */}
                </div>
                {guest.attachments.map(attachment => (
                  <AttachmentChip
                    key={attachment.id}
                    fileName={attachment.file_name}
                    url={attachment.file}
                    //   disabled={disabled}
                  />
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const View = styled.div`
  height: 100%;
  overflow: auto;
`;
