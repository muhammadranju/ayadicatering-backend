import { Schema, model } from 'mongoose';
import ICategory from './categorys.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Category = model<ICategory>('Category', categorySchema);

export default Category;
