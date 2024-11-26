export class CreateOrderDTO {
  email: string;
  phone: string;
  tickets: [
    {
      film: string;
      session: string;
      daytime: Date;
      day: string;
      time: string;
      row: number;
      seat: number;
      price: number;
    },
  ];
}
