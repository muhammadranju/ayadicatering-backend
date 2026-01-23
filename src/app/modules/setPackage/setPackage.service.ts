import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import unlinkFile from '../../../shared/unlinkFile';
import { IPaginationOptions } from '../../../types/pagination';
import ISetPackage from './setPackage.interface';
import SetPackage from './setPackage.model';

const createSetPackage = async (payload: ISetPackage) => {
  const result = await SetPackage.create(payload);
  return result;
};

const getAllSetPackage = async (paginationOptions: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const result = await SetPackage.find()
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await SetPackage.countDocuments();

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

const getSingleSetPackage = async (id: string) => {
  const result = await SetPackage.findById(id);
  return result;
};

const updateSetPackage = async (id: string, payload: ISetPackage) => {
  const isExistCategory = await SetPackage.findById(id);
  if (!isExistCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "SetPackage doesn't exist!");
  }
  if (payload.image) {
    unlinkFile(isExistCategory.image);
  }

  const result = await SetPackage.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteSetPackage = async (id: string) => {
  const isExist = await SetPackage.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'SetPackage not found');
  }

  if (isExist.image) {
    unlinkFile(isExist.image);
  }
  const result = await SetPackage.findByIdAndDelete(id);
  return result;
};

export const SetPackageService = {
  createSetPackage,
  getAllSetPackage,
  getSingleSetPackage,
  updateSetPackage,
  deleteSetPackage,
};
