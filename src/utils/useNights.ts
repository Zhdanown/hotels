import { useSelector } from "react-redux";
import { getParams } from "../redux/booking";

export const useNightsAdjustedForRooms = (rawNights: number) => {
    const { rooms_count } = useSelector(getParams);
    const nights = rawNights / (rooms_count ?? 0);
  
    return nights;
  }
  
  