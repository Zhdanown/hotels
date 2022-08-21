import { Guest } from "../../Step3/AccompanyingGuests/AddedGuests";

export type Payment = {
  amount: number;
  paid: true;
  paid_time: string;
  payment_category: string;
  payment_link: string;
  payment_selected_method: string;
  payment_type: string;
};

export type Room = {
  code: "DR";
  name: string;
  long_description: string;
  short_description: string;
  square: null | number;
  img: string;
};

export type Rate = {
  code: string;
  id: number;
  name: string;
  short_description: string;
  long_description: string;
};


export type BookingDetails = {
  adults: number;
  arrival: string;
  // child_categories: [{…}]
  confirmed: boolean;
  created: string;
  departure: string;
  external_id: string;
  id: number;
  is_sber_employee: boolean;
  link_key: string;
  price: string;
  rate: Rate;
  accompanying_guests: Guest[];
  reservation_payments: Payment[];
  room_type: Room;
  rooms_count: number;
  status: string;
};

