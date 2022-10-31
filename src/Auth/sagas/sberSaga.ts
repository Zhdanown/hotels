import api from "../../redux/api";
import { SET_BLOCKS } from "../../redux/booking";
import { fetcher } from "../../redux/utils";

export const signInWithSber = async (oneTimePass: string) => {
  try {
    const response = await api.get(
      `/api/v1/users/teamID-token?otp=${oneTimePass}`
    );
    const { token } = response.data;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("team_one_time_pass");
    window.location.search = searchParams.toString();

    return { token };
  } catch (error) {
    return { signInError: error };
  }
};

export const loadBlocksWatcher = () => async(dispatch: any, getState: any) => {
  const state = getState()
  const hotelId = state.hotelConfig.params.id;
  const url = `/api/v1/blocks/${hotelId}/`;
  const { data, err } = await fetcher(url) || { data: null, err: null };
  dispatch({ type: SET_BLOCKS, payload: data })
  
}