import IBuildPackage from './buildPackage.interface';
import { Schema, model } from 'mongoose';

const buildPackageSchema = new Schema<IBuildPackage>(
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
    price: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const BuildPackage = model<IBuildPackage>('BuildPackage', buildPackageSchema);

export default BuildPackage;
