import { z } from 'zod';
import { EStatus } from './orders.interface';

const createOrderValidation = z.object({
  person: z.string().min(1, 'Person is required'),
  menu: z.string().min(1, 'Menu is required'),
  guest: z.string().min(1, 'Guest is required'),
  itemName: z.string().min(1, 'Item name is required'),
  items: z.array(z.string()).min(1, 'Items is required'),
  totalPrice: z.number().min(1, 'Total price is required'),
});

export { createOrderValidation };
