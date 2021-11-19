export type Reserva = {
  day: number;
  month: number;
  year: number;
  seat: Seat[];
};

export type Seats={
    puesto: number;
    email: undefined;
}
export type Seat= Seats;


