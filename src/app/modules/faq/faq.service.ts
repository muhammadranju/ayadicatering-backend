import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import IFaq from './faq.interface';
import Faq from './faq.model';

const createFaqToDB = async (faqData: IFaq) => {
  const result = await Faq.create(faqData);
  return result;
};

const getAllFaqFromDB = async (paginationOptions: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const result = await Faq.find()
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await Faq.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
      sortBy,
      sortOrder,
    },
    data: result,
  };
};

const updateFaqToDB = async (id: string, faqData: IFaq) => {
  const result = await Faq.findByIdAndUpdate(id, faqData, { new: true });
  return result;
};

const deleteFaqToDB = async (id: string) => {
  const result = await Faq.findByIdAndDelete(id);
  return result;
};

export const FaqService = {
  createFaqToDB,
  getAllFaqFromDB,
  updateFaqToDB,
  deleteFaqToDB,
};
