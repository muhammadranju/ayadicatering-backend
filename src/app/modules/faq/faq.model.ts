import { Schema, model } from 'mongoose';
import IFaq from './faq.interface';

const faqSchema = new Schema<IFaq>(
  {
    question: {
      type: String,
      required: true,
    },
    questionArabic: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    answerArabic: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Faq = model<IFaq>('Faq', faqSchema);

export default Faq;
