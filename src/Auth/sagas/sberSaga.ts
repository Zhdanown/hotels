import api from "../../redux/api";

export const signInWithSber = async (oneTimePass: string) => {
  try {
    const response = await api.get(
      `/api/v1/users/sberID-token?otp=${oneTimePass}`
    );
    const { token } = response.data;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("one_time_pass");
    window.location.search = searchParams.toString();

    return { token };
  } catch (error) {
    return { signInError: error };
  }
};
