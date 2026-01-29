import { z } from 'zod';

// Time format validation regex (HH:mm)
const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const blockFullDateValidation = z.object({
  body: z.object({
    date: z.string().min(1, 'Date is required'),
    reason: z.string().min(1, 'Reason is required'),
  }),
});

const blockTimeSlotsValidation = z.object({
  body: z.object({
    date: z.string().min(1, 'Date is required'),
    timeSlots: z
      .array(
        z.object({
          startTime: z
            .string()
            .regex(timeFormatRegex, 'Start time must be in HH:mm format'),
          endTime: z
            .string()
            .regex(timeFormatRegex, 'End time must be in HH:mm format'),
          reason: z.string().optional(),
        }),
      )
      .min(1, 'At least one time slot is required'),
  }),
});

const unblockDateValidation = z.object({
  body: z.object({
    date: z.string().min(1, 'Date is required'),
  }),
});

const unblockTimeSlotsValidation = z.object({
  body: z.object({
    date: z.string().min(1, 'Date is required'),
    timeSlots: z
      .array(
        z.object({
          startTime: z
            .string()
            .regex(timeFormatRegex, 'Start time must be in HH:mm format'),
          endTime: z
            .string()
            .regex(timeFormatRegex, 'End time must be in HH:mm format'),
        }),
      )
      .min(1, 'At least one time slot is required'),
  }),
});

const bulkBlockDatesValidation = z.object({
  body: z.object({
    dates: z.array(z.string()).min(1, 'At least one date is required'),
    reason: z.string().min(1, 'Reason is required'),
  }),
});

const getBlockedDatesValidation = z.object({
  query: z.object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  }),
});

const getAvailableTimeSlotsValidation = z.object({
  query: z
    .object({
      date: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .refine(data => data.date || (data.startDate && data.endDate), {
      message: 'Either date or both startDate and endDate must be provided',
    }),
});

const getAllDeliverySlotsValidation = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isBlocked: z.string().optional(),
  }),
});

const createDefaultTimeSlotsValidation = z.object({
  body: z.object({
    date: z.string().min(1, 'Date is required'),
    defaultSlots: z
      .array(
        z.object({
          startTime: z
            .string()
            .regex(timeFormatRegex, 'Start time must be in HH:mm format'),
          endTime: z
            .string()
            .regex(timeFormatRegex, 'End time must be in HH:mm format'),
          isBlocked: z.boolean().optional(),
          blockedReason: z.string().optional(),
          maxCapacity: z.number().optional(),
          currentBookings: z.number().optional(),
        }),
      )
      .optional(),
  }),
});

export {
  blockFullDateValidation,
  blockTimeSlotsValidation,
  unblockDateValidation,
  unblockTimeSlotsValidation,
  bulkBlockDatesValidation,
  getBlockedDatesValidation,
  getAvailableTimeSlotsValidation,
  getAllDeliverySlotsValidation,
  createDefaultTimeSlotsValidation,
};
