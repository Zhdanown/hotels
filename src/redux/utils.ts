import api from "./api";

export const fetcher = async (url: string) => {
    try {
      const res = await api.get(url);
      if (res.status === 200) {
        return { data: res.data };
      }
    } catch (err) {
      return { err };
    }
  };