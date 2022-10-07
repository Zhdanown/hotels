import { all, call, put, select, takeEvery } from "redux-saga/effects";
import { getUserGuest } from "../../Auth/authReducer";
import { fetchUserInfo } from "../../Auth/sagas/authSaga";
import api from "../../redux/api";
import { getBookingDetails } from "../../redux/booking/bookingSaga";
import { getConfigId } from "../../redux/hotelConfig";
import { Attachment } from "./AddedGuests";

const CREATE_EXTRA_GUEST = "extra_guests/CREATE";
const DELETE_EXTRA_GUEST = "extra_guests/DELETE";
const UPDATE_EXTRA_GUEST = "extra_guests/UPDATE";
const CREATE_GUEST_PENDING = "extra_guests/CREATE_PENDING";
const DELETE_GUEST_PENDING = "extra_guests/DELETE_PENDING";

const UPDATE_BOOKING_GUEST_LIST = "extra_guests/UPDATE_LIST_IN_BOOKING";
const UPDATE_GUEST_LIST_PENDING = "extra_guests/UPDATE_GUEST_LIST_PENDING";

export type ExtraGuest = {
  guestId: number | null;
  firstName: string;
  lastName: string;
  userId: number;
  files: File[];
};

const initialState = {
  isCreateGuestPending: false,
  isDeleteGuestPending: false,
  isUpdateGuestListPending: false,
};

export function extraGuestReducer(state = initialState, action: any) {
  switch (action.type) {
    case CREATE_GUEST_PENDING:
      return {
        ...state,
        isCreateGuestPending: action.isPending,
      };
    case DELETE_GUEST_PENDING:
      return {
        ...state,
        isDeleteGuestPending: action.isPending,
      };
    case UPDATE_GUEST_LIST_PENDING:
      return {
        ...state,
        isUpdateGuestListPending: action.isPending,
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

export const deleteExtraGuest = (guestId: number) => {
  return { type: DELETE_EXTRA_GUEST, guestId };
};
export const deleteGuestPending = (isPending: boolean) => {
  return { type: DELETE_GUEST_PENDING, isPending };
};

export const updateBookingGuestList = (payload: {
  bookingId: string;
  guestIds: number[];
}) => {
  return { type: UPDATE_BOOKING_GUEST_LIST, payload };
};

export const updateBookingGuestListPending = (isPending: boolean) => {
  return { type: UPDATE_GUEST_LIST_PENDING, isPending };
};

type GuestFileToDelete = {
  attachment_id: number;
  guest_id: number;
};

/** selectors */
type State = { guests: typeof initialState };
export const getIsCreateGuestPending = (state: State) =>
  state.guests.isCreateGuestPending;
export const getIsDeleteGuestPending = (state: State) =>
  state.guests.isDeleteGuestPending;
export const getIsUpdateGuestListPending = (state: State) =>
  state.guests.isUpdateGuestListPending;

/**============ */

export function* createGuestSaga() {
  yield takeEvery(CREATE_EXTRA_GUEST, createGuestWatcher);
  yield takeEvery(UPDATE_EXTRA_GUEST, updateGuestWatcher);
  yield takeEvery(DELETE_EXTRA_GUEST, deleteGuestWatcher);
  yield takeEvery(UPDATE_BOOKING_GUEST_LIST, updateBookingGuestListWatcher);
}

function* createGuestWatcher(action: {
  type: string;
  payload: ExtraGuest;
}): any {
  const { files, userId, firstName, lastName } = action.payload;
  const hotelId = yield select(getConfigId);

  yield put(creatingGuestPending(true));

  const attachments = yield call(getAttachments, userId, files);

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

function* getAttachments(userId: number, files: File[]) {
  if (!files.length) {
    return [];
  }

  const { id } = yield call(uploadFile, { userId, files });
  return [id];
}

function* updateGuestWatcher(action: {
  type: string;
  payload: ExtraGuest;
}): any {
  const { files, userId, firstName, lastName, guestId } = action.payload;
  const hotelId = yield select(getConfigId);

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

  const { id } = !files.length
    ? { id: null }
    : yield call(uploadFile, { userId, files });

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

function* deleteGuestWatcher(action: { type: string; guestId: number }): any {
  yield put(deleteGuestPending(true));
  const hotelId = yield select(getConfigId);
  yield call(deleteGuest, hotelId, action.guestId);
  yield call(fetchUserInfo);
  yield put(deleteGuestPending(false));
}

const deleteGuest = async (hotelId: number, guestId: number) => {
  const response = await api.post(`/api/v1/users/delete-guest/${hotelId}/`, {
    guest_id: guestId,
  });
  return response.data;
};

function* updateBookingGuestListWatcher(action: {
  type: string;
  payload: { bookingId: string; guestIds: number[] };
}) {
  yield put(updateBookingGuestListPending(true));
  const { bookingId, guestIds } = action.payload;

  yield call(submitNewBookingGuestList, bookingId, guestIds);
  yield all([call(fetchUserInfo), call(getBookingDetails, { bookingId })]);
  yield put(updateBookingGuestListPending(false));
}

const submitNewBookingGuestList = async (
  bookingId: string,
  guestIds: number[]
) => {
  const response = await api.post(
    `/api/v1/reservation/edit/guests/${bookingId}/`,
    guestIds
  );
  return response.data;
};
