export interface IServiceOrder {
  id: number;
  vehicle_id: number;
  employee_id: number;
  user_id: number;
  description: string;
  order_date: Date;
}
