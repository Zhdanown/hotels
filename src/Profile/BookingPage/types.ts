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
