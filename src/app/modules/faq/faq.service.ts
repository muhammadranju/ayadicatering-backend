import IFaq from './faq.interface';
import Faq from './faq.model';

const createFaqToDB = async (faqData: IFaq) => {
  const result = await Faq.create(faqData);
  return result;
};

const getAllFaqFromDB = async () => {
  const result = await Faq.find();
  return result;
};

const updateFaqToDB = async (id: string, faqData: IFaq) => {
  const result = await Faq.findByIdAndUpdate(id, faqData, { new: true });
  return result;
};

export const FaqService = { createFaqToDB, getAllFaqFromDB, updateFaqToDB };
