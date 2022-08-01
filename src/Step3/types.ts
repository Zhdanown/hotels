export type Guest = {
  username: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  date_of_birth: null; // TODO
  is_hotel_guest: boolean;
  password: string;
  password_confirm: string;
};
