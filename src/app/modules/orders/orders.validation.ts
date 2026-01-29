import { z } from 'zod';
import { EStatus, EOrderType, EPaymentMethod } from './orders.interface';

// DateTime schema
const dateTimeSchema = z.object({
  date: z.string().min(1, 'Delivery date is required'),
  time: z.string().min(1, 'Delivery time is required'),
});

// Delivery Details schema
const deliveryDetailsSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area is required'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  email: z.string().email('Invalid email format'),
  note: z.string().optional(),
});

// Pricing schema
const pricingSchema = z.object({
  basePrice: z.number().min(0, 'Base price must be positive'),
  addonsPrice: z.number().min(0, 'Addons price must be positive'),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  vat: z.number().min(0, 'VAT must be positive'),
  total: z.number().min(0, 'Total must be positive'),
});

// Selected Package schema (for SET_PACKAGE orders)
const selectedPackageSchema = z.object({
  _id: z.string().optional(),
  platterName: z.string(),
  platterNameArabic: z.string(),
  description: z.string(),
  descriptionArabic: z.string(),
  image: z.string(),
  items: z.array(z.string()),
  itemsArabic: z.array(z.string()),
  price: z.number(),
  person: z.number(),
  isAvailable: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

// Menu Selection schema (for BUILD_YOUR_OWN orders)
const menuSelectionSchema = z.object({
  salad: z.string().optional(),
  appetizers: z.array(z.string()).optional(),
  mains: z.array(z.string()).optional(),
});

// Create Order Validation
const createOrderValidation = z.object({
  body: z
    .object({
      orderType: z.nativeEnum(EOrderType),
      selectedPackage: selectedPackageSchema.optional(),
      menuSelection: menuSelectionSchema.optional(),
      addons: z.array(z.string()).default([]),
      dateTime: dateTimeSchema,
      deliveryDetails: deliveryDetailsSchema,
      paymentMethod: z.nativeEnum(EPaymentMethod),
      pricing: pricingSchema,
      timestamp: z.string().optional(),
    })
    .refine(
      data => {
        // If orderType is SET_PACKAGE, selectedPackage must be present
        if (data.orderType === EOrderType.SET_PACKAGE) {
          return !!data.selectedPackage;
        }
        // If orderType is BUILD_YOUR_OWN, menuSelection must be present
        if (data.orderType === EOrderType.BUILD_YOUR_OWN) {
          return !!data.menuSelection;
        }
        return true;
      },
      {
        message:
          'SET_PACKAGE orders require selectedPackage, BUILD_YOUR_OWN orders require menuSelection',
      },
    ),
});

// Update Order Status Validation
const updateOrderStatusValidation = z.object({
  body: z.object({
    status: z.nativeEnum(EStatus),
  }),
});

// Update Order Validation (partial update)
const updateOrderValidation = z.object({
  body: z
    .object({
      orderType: z.nativeEnum(EOrderType).optional(),
      selectedPackage: selectedPackageSchema.optional(),
      menuSelection: menuSelectionSchema.optional(),
      addons: z.array(z.string()).optional(),
      dateTime: dateTimeSchema.optional(),
      deliveryDetails: deliveryDetailsSchema.optional(),
      paymentMethod: z.nativeEnum(EPaymentMethod).optional(),
      pricing: pricingSchema.optional(),
      status: z.nativeEnum(EStatus).optional(),
    })
    .partial(),
});

// Get Orders Query Validation
const getOrdersQueryValidation = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    orderType: z.nativeEnum(EOrderType).optional(),
    status: z.nativeEnum(EStatus).optional(),
    email: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

// Get Orders by Email Validation
const getOrdersByEmailValidation = z.object({
  query: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export {
  createOrderValidation,
  updateOrderStatusValidation,
  updateOrderValidation,
  getOrdersQueryValidation,
  getOrdersByEmailValidation,
};
