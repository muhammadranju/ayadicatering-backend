interface IOrder {
  person: string;

  menu: string;
  guest: string;
  itemName: string;
  items: string[];
  totalPrice: number;
  status: string;
}

export default IOrder;
