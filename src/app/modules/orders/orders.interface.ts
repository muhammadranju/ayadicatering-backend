import { Types } from 'mongoose';

// Order Types
export enum EOrderType {
  SET_PACKAGE = 'SET_PACKAGE',
  BUILD_YOUR_OWN = 'BUILD_YOUR_OWN',
}

// Status Enum
export enum EStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  preparing = 'preparing',
  delivered = 'delivered',
  cancelled = 'cancelled',
}

// Payment Method
export enum EPaymentMethod {
  cash = 'cash',
  credit = 'credit',
  debit = 'debit',
}

// Set Package Structure (populated from SetPackage model)
export interface ISelectedPackage {
  _id?: string;
  platterName: string;
  platterNameArabic: string;
  description: string;
  descriptionArabic: string;
  image: string;
  items: string[];
  itemsArabic: string[];
  price: number;
  person: number;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Menu Selection Structure (for BUILD_YOUR_OWN)
export interface IMenuSelection {
  salad?: string | Types.ObjectId; // Reference to BuildPackage
  appetizers?: (string | Types.ObjectId)[]; // References to BuildPackage
  mains?: (string | Types.ObjectId)[]; // References to BuildPackage
}

// Date Time Structure
export interface IDateTime {
  date: Date;
  time: string; // e.g., "06:00 PM"
}

// Delivery Details Structure
export interface IDeliveryDetails {
  name: string;
  street: string;
  city: string;
  area: string;
  whatsapp: string;
  email: string;
  note?: string;
}

// Pricing Structure
export interface IPricing {
  basePrice: number;
  addonsPrice: number;
  subtotal: number;
  vat: number;
  total: number;
}

// Main Order Interface
export interface IOrder {
  orderType: EOrderType;

  // For SET_PACKAGE orders
  selectedPackage?: ISelectedPackage;

  // For BUILD_YOUR_OWN orders
  menuSelection?: IMenuSelection;

  // Common fields
  addons: string[]; // Can be IDs or static identifiers
  dateTime: IDateTime;
  deliveryDetails: IDeliveryDetails;
  paymentMethod: EPaymentMethod;
  pricing: IPricing;
  status: EStatus;

  // User reference (optional, if tracking which user placed the order)
  userId?: Types.ObjectId;

  // Auto-generated
  timestamp?: Date;
}
