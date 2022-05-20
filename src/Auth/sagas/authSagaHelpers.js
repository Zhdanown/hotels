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
    const { token } = response.data;
    return { token };
  } catch (error) {
    return { signInError: error };
  }
}

export async function sberSignIn(bodyRequest) {
  try {
    const response = await api.post("/api/v1/users/sberID-auth", {
      username: "nik",
    });
    const { token } = response.data;
    return { token };
  } catch (error) {
    return { signInError: error };
  }
}
