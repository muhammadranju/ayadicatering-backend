import { Types } from 'mongoose';

interface IBuildPackage {
  platterName: string;
  platterNameArabic: string;
  description: string;
  descriptionArabic: string;
  image: string;
  price: number;
  isAvailable: boolean;
  categoryId: Types.ObjectId;
}

export default IBuildPackage;
