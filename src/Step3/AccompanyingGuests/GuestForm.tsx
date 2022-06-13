import { Form, Formik, useFormikContext } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getUser } from "../../Auth/authReducer";
import Button from "../../components/Button";
import { FormikInput } from "../../components/Input";
import Loader from "../../components/Loader";
import { addExtraGuest, getIsCreateGuestPending } from "../AddedGuests.saga";

export type GuestFormFields = {
  first_name: string;
  last_name: string;
  files: FileList | null;
  description: string;
  id: number | null;
};

type GuestFormProps = {
  initialValues: GuestFormFields;
};

export const GuestForm = ({ initialValues }: GuestFormProps) => {
  const isCreateGuestPending = useSelector(getIsCreateGuestPending);
  const { id: userId }: { id: number } = useSelector(getUser) || {};
  const dispatch = useDispatch();

  return (
    <div style={{ marginTop: 40 }}>
      <Formik
        // key to rerender form when initialValues change 
        // (enableReinitialize doesn't work)
        key={initialValues.first_name + initialValues.last_name}
        initialValues={initialValues}
        //   validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          const { first_name, last_name, files, description } = values;

          dispatch(
            addExtraGuest({
              hotelId: 1,
              userId,
              firstName: first_name,
              lastName: last_name,
              files: files ? Array.from(files) : [],
              description,
            })
          );
          setSubmitting(false);
        }}
      >
        <NewGuestForm isPending={isCreateGuestPending} />
      </Formik>
    </div>
  );
};

const NewGuestForm = ({ isPending }: { isPending: boolean }) => {
  const { setFieldValue, getFieldProps } = useFormikContext();

  const changePreview = (files: File[]) => {
    const [file] = files;
    const preview = document.getElementById("preview") as any;
    const reader = new FileReader();
    reader.onloadend = function () {
      preview.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  };

  return (
    <Form style={{ position: "relative" }}>
      <FormikInput type="text" label="Имя" name="first_name" />
      <FormikInput type="text" label="Фамилия" name="last_name" />

      <input
        type="file"
        name="file"
        onChange={event => {
          const fileList = event.target.files;
          const files = fileList ? Array.from(fileList) : [];
          setFieldValue("files", files);
          changePreview(files);
        }}
        multiple
      />

      {getFieldProps("files").value && (
        <FormikInput type="text" label="Описание" name="description" />
      )}

      <Preview id="preview" src="" alt="preview..." />

      <Button block type="submit">
        Зарегистрировать нового гостя
      </Button>

      {isPending ? (
        <LoadPending>
          <Loader />
          <span>Добавляем гостя...</span>
        </LoadPending>
      ) : null}
    </Form>
  );
};

const LoadPending = styled.div`
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

const Preview = styled.img`
  border-radius: 4px;
  height: 200px;
  width: 100%;
  box-shadow: 0 2px 8px -1px grey;
  object-fit: cover;
  margin: 16px 0;
`;
