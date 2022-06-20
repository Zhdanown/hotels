import { call, put, select, takeEvery } from "redux-saga/effects";
import { getUserGuest } from "../../Auth/authReducer";
import { fetchUserInfo } from "../../Auth/sagas/authSaga";
import api from "../../redux/api";
import { Attachment } from "./AddedGuests";

const CREATE_EXTRA_GUEST = "extra_guests/CREATE";
const UPDATE_EXTRA_GUEST = "extra_guests/UPDATE";
const CREATE_GUEST_PENDING = "extra_guests/CREATE_PENDING";

export type ExtraGuest = {
  guestId: number | null;
  firstName: string;
  lastName: string;
  userId: number;
  hotelId: number;
  files: File[];
};

const initialState = {
  isCreateGuestPending: false,
  userUpdateCompleted: null,
};

export function extraGuestReducer(state = initialState, action: any) {
  switch (action.type) {
    case CREATE_GUEST_PENDING:
      return {
        ...state,
        isCreateGuestPending: action.isPending,
      };
    default:
      return state;
  }
}

/** actions */
export const createExtraGuest = (payload: ExtraGuest) => {
  return { type: CREATE_EXTRA_GUEST, payload };
};

export const updateExtraGuest = (payload: ExtraGuest) => {
  return { type: UPDATE_EXTRA_GUEST, payload };
};

export const creatingGuestPending = (isPending: boolean) => {
  return { type: CREATE_GUEST_PENDING, isPending };
};

type GuestFileToDelete = {
  attachment_id: number;
  guest_id: number;
};

/** selectors */
type State = { guests: typeof initialState };
export const getIsCreateGuestPending = (state: State) =>
  state.guests.isCreateGuestPending;

/**============ */

export function* createGuestSaga() {
  yield takeEvery(CREATE_EXTRA_GUEST, createGuestWatcher);
  yield takeEvery(UPDATE_EXTRA_GUEST, updateGuestWatcher);
}

function* createGuestWatcher(action: {
  type: string;
  payload: ExtraGuest;
}): any {
  const { files, userId, hotelId, firstName, lastName } = action.payload;

  yield put(creatingGuestPending(true));
  const { id } = yield call(uploadFile, { userId, files });

  const attachments = [id];

  const extraGuestBodyRequest = {
    id: null,
    email: null,
    first_name: firstName,
    last_name: lastName,
    attachments,
  };

  yield call(createOrUpdateGuest, hotelId, extraGuestBodyRequest);

  yield call(fetchUserInfo);
  yield put(creatingGuestPending(false));
}

function* updateGuestWatcher(action: {
  type: string;
  payload: ExtraGuest;
}): any {
  const { files, userId, hotelId, firstName, lastName, guestId } =
    action.payload;

  yield put(creatingGuestPending(true));


  if (files.length) {
    // new files were selected -> delete old attachments
    const userGuest: { attachments: Attachment[] } = yield select(
      getUserGuest,
      guestId
    );
    const [oldAttachment] = userGuest.attachments;

    if (guestId && oldAttachment) {
      // delete old file
      const deattachFileBodyReq = {
        guest_id: guestId,
        attachment_id: oldAttachment.id,
      };
      yield call(deattachGuestFile, userId, deattachFileBodyReq);
    }
  }

  const { id } = !files.length ? { id: null } : yield call(uploadFile, { userId, files });

  const extraGuestBodyRequest = {
    id: guestId,
    email: null,
    first_name: firstName,
    last_name: lastName,
    attachments: id ? [id] : [],
  };

  yield call(createOrUpdateGuest, hotelId, extraGuestBodyRequest);

  yield call(fetchUserInfo);
  yield put(creatingGuestPending(false));
}

type CreateGuestBodyRequest = {
  id: null | number; 
  email: null;
  first_name: string;
  last_name: string;
  attachments?: number[];
};

const createOrUpdateGuest = async (
  hotelId: number,
  bodyRequest: CreateGuestBodyRequest
) => {
  try {
    const res = await api.post(`/api/v1/users/guest/${hotelId}/`, bodyRequest);
    console.log(res);
    if (res.status === 200) {
      return res.data.id;
    }
  } catch (err) {
    debugger;
    // if (err?.status === 500) {
    //   // непредвиденная ошибка
    // }
    return { err };
  }
};

type UploadBody = {
  files: File[];
  userId: number;
};

const uploadFile = async (
  bodyRequest: UploadBody
): Promise<{ id: number; file: string }> => {
  const { files, userId } = bodyRequest;
  const [file] = files;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", String(userId));
  formData.append("description", "");

  const response = await api.post(
    `/api/v1/users/attachments/upload/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

const deattachGuestFile = async (
  userId: number,
  fileToDelete: GuestFileToDelete
) => {
  const response = await api.post(
    `/api/v1/users/delete-guest-attachments/${userId}/`,
    fileToDelete
  );
  return response.data;
};
