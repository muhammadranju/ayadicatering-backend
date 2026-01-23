export interface IOrder {
  person: string;

  menu: string;
  guest: string;
  itemName: string;
  items: string[];
  totalPrice: number;
  status: EStatus;
}

export enum EStatus {
  pending = 'pending',
  completed = 'completed',
  cancelled = 'cancelled',
}
