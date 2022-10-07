import { Form, Formik, useFormikContext } from "formik";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getUser } from "../../Auth/authReducer";
import Button from "../../components/Button";
import { FormikInput } from "../../components/Input";
import Loader from "../../components/Loader";
import { Attachment } from "./AddedGuests";
import {
  createExtraGuest,
  getIsCreateGuestPending,
  updateExtraGuest,
} from "./AddedGuests.saga";
import { AttachmentChip } from "./Attachment";

export type GuestFormFields = {
  first_name: string;
  last_name: string;
  files?: FileList | null;
  attachment?: Attachment | null;
  id: number | null;
};

type GuestFormProps = {
  initialValues: GuestFormFields;
  attachments?: Attachment[];
  goBack: () => void;
};

const useActionWhenPendingStops = (pending: boolean, action: () => void) => {
  const pendingStarted = useRef<boolean>(false);

  useEffect(() => {
    if (pendingStarted.current && !pending) {
      pendingStarted.current = false;
      action();
    }
    if (pending) {
      pendingStarted.current = true;
    }
  }, [action, pending]);
};

export const GuestForm = ({ initialValues, goBack }: GuestFormProps) => {
  const isCreateGuestPending = useSelector(getIsCreateGuestPending);
  const user = useSelector(getUser) || {};
  const { id: userId }: { id: number } = user;

  useActionWhenPendingStops(isCreateGuestPending, goBack);

  const dispatch = useDispatch();

  function validate(values: GuestFormFields) {
    const errors = {} as { [P in keyof GuestFormFields]: string };

    if (!values.first_name) {
      errors.first_name = "Это поле не должно быть пустым";
    }
    if (!values.last_name) {
      errors.last_name = "Это поле не должно быть пустым";
    }

    return errors;
  }

  return (
    <div style={{ marginTop: 40 }}>
      <Formik
        // key to rerender form when initialValues change
        // (enableReinitialize doesn't work)
        key={initialValues.first_name + initialValues.last_name}
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const { first_name, last_name, files, id, attachment } = values;

          const getFiles = () => {
            if (attachment) {
              // attachment was not changed
              return [];
            }
            // attachment was changed -> save new files
            return files ? Array.from(files) : [];
          };

          const guest_ = {
            guestId: id || null,
            userId,
            firstName: first_name,
            lastName: last_name,
            files: getFiles(),
          };

          const action = id ? updateExtraGuest : createExtraGuest;
          dispatch(action(guest_));

          setSubmitting(false);
        }}
      >
        <NewGuestForm isPending={isCreateGuestPending} />
      </Formik>
    </div>
  );
};

const NewGuestForm = ({ isPending }: { isPending: boolean }) => {
  const { setFieldValue, getFieldProps, isValid } = useFormikContext();

  const guestId = getFieldProps("id").value;
  const files = getFieldProps("files").value as FileList;
  const attachment = getFieldProps("attachment").value;

  const replaceFile = () => {
    setFieldValue("files", null);
  };

  return (
    <Form style={{ position: "relative" }}>
      <FormikInput type="text" label="Имя" name="first_name" />
      <FormikInput type="text" label="Фамилия" name="last_name" />

      <FileContainer>
        {!attachment && !files?.length && (
          <input
            type="file"
            name="file"
            accept="image/jpeg, image/png, application/pdf"
            onChange={event => {
              const fileList = event.target.files;
              const files = fileList ? Array.from(fileList) : [];
              setFieldValue("files", files);
            }}
          />
        )}

        {attachment && (
          <AttachmentChip
            fileName={attachment.file_name}
            url={attachment.file}
            onDelete={() => setFieldValue("attachment", null)}
          />
        )}

        {files?.length && (
          <AttachmentChip fileName={files[0].name} file={files[0]} onDelete={replaceFile} />
        )}
      </FileContainer>

      <Button block type="submit" disabled={!isValid} style={{ marginTop: 20 }}>
        {guestId ? "Сохранить изменения" : "Создать нового гостя"}
      </Button>

      {isPending ? (
        <LoadingPending>
          <Loader />
          <span>{guestId ? "Обновляем данные..." : "Добавляем гостя..."}</span>
        </LoadingPending>
      ) : null}
    </Form>
  );
};

const FileContainer = styled.div`
  height: 60;
  display: flex;
  align-items: center;
`;

const LoadingPending = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.8;
  background: white;
`;
