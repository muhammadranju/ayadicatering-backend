import { Schema, model } from 'mongoose';
import ISetPackage from './setPackage.interface';

const setPackageSchema = new Schema<ISetPackage>(
  {
    platterName: {
      type: String,
      required: true,
    },
    platterNameArabic: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionArabic: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    items: {
      type: [String],
      required: true,
    },
    itemsArabic: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    person: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const SetPackage = model<ISetPackage>('SetPackage', setPackageSchema);

export default SetPackage;
