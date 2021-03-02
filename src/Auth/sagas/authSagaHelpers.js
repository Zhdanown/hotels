import api from "../../redux/api";

export async function getUserInfo() {
  try {
    const response = await api.get("/api/v1/users/info");
    return { userInfo: response.data };
  } catch (error) {
    return { userInfoError: error };
  }
}

export async function signIn(bodyRequest) {
  try {
    const response = await api.post("/api/v1/users/jwt-token/", bodyRequest);
    const token = response.data.token;
    return { token };
  } catch (error) {
    return { signInError: error };
  }
}

export function findProfileId(userInfo, hotelId) {
  const profileId = userInfo.hotel_users.find(x => x.hotel === hotelId)
    .external_id;
  return profileId;
}
