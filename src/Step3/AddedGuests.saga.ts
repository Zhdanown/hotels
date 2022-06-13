import { call, put, takeEvery } from "redux-saga/effects";
import { fetchUserInfo } from "../Auth/sagas/authSaga";
import api from "../redux/api";

const CREATE_EXTRA_GUEST = "extra_guests/CREATE";
const CREATE_GUEST_PENDING = "extra_guests/CREATE_PENDING";

export type NewExtraGuest = {
  firstName: string;
  lastName: string;
  userId: number;
  hotelId: number;
  files: File[];
  description: string;
};

const initialState = {
  isCreateGuestPending: false,
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
export const addExtraGuest = (payload: NewExtraGuest) => {
  return { type: CREATE_EXTRA_GUEST, payload };
};

export const creatingGuestPending = (isPending: boolean) => {
  return { type: CREATE_GUEST_PENDING, isPending };
};

/** selectors */
type State = { guests: typeof initialState };
export const getIsCreateGuestPending = (state: State) =>
  state.guests.isCreateGuestPending;

/**============ */

export function* createGuestSaga() {
  yield takeEvery(CREATE_EXTRA_GUEST, createExtraGuestWatcher);
}

function* createExtraGuestWatcher(action: {
  type: string;
  payload: NewExtraGuest;
}): any {
  const { files, userId, hotelId, firstName, lastName, description } =
    action.payload;

  yield put(creatingGuestPending(true));
  const { id } = yield call(uploadFile, { userId, files, description });

  const attachments = [id];

  const extraGuestBodyRequest = {
    id: null, // send null to create new user
    email: null,
    first_name: firstName,
    last_name: lastName,
    attachments,
  };

  yield call(
    createExtraGuest,
    hotelId,
    extraGuestBodyRequest
  );
  
  yield call(fetchUserInfo);
  yield put(creatingGuestPending(false));
}

type CreateGuestBodyRequest = {
  id: null; // send null to create new user
  email: null;
  first_name: string;
  last_name: string;
  attachments: number[];
};

export const createExtraGuest = async (
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
  description: string;
};

export const uploadFile = async (
  bodyRequest: UploadBody
): Promise<{ id: number; file: string }> => {
  const { files, userId, description } = bodyRequest;
  const [file] = files;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", String(userId));
  formData.append("description", description);

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
