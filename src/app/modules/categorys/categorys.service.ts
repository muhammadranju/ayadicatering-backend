import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import Category from './categorys.model';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';

const createCategoryToDB = async (categoryData: any) => {
  const result = await Category.create(categoryData);
  return result;
};

const getAllCategoryFromDB = async (paginationOptions: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const result = await Category.find()
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments();

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

const getSingleCategoryFromDB = async (id: string) => {
  const result = await Category.findById(id);
  return result;
};

const updateCategoryToDB = async (id: string, categoryData: any) => {
  const isExistCategory = await Category.findById(id);
  if (!isExistCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist!");
  }
  if (categoryData.image) {
    unlinkFile(isExistCategory.image);
  }
  const result = await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
  });
  return result;
};

const deleteCategoryToDB = async (id: string) => {
  const isExistCategory = await Category.findById(id);

  if (!isExistCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist!");
  }

  if (isExistCategory.image) {
    unlinkFile(isExistCategory.image);
  }
  const result = await Category.findByIdAndDelete(id);
  return result;
};

export const CategoryService = {
  createCategoryToDB,
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  updateCategoryToDB,
  deleteCategoryToDB,
};
