import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import IBuildPackage from './buildPackage.interface';
import BuildPackage from './buildPackage.model';

const createBuildPackageToDB = async (data: IBuildPackage) => {
  const result = await BuildPackage.create(data);
  return result;
};

const getAllBuildPackageFromDB = async (
  paginationOptions: IPaginationOptions,
  category: string,
) => {
  const {
    page,
    limit,
    skip,
    sortBy,
    sortOrder = 'asc',
  } = paginationHelper.calculatePagination(paginationOptions);

  const result = await BuildPackage.find(
    category ? { categoryId: category } : {},
  )
    .populate('categoryId')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await BuildPackage.countDocuments();

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

const getSingleBuildPackageFromDB = async (id: string) => {
  const result = await BuildPackage.findById(id);
  return result;
};

const updateBuildPackageToDB = async (id: string, data: IBuildPackage) => {
  const result = await BuildPackage.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const deleteBuildPackageToDB = async (id: string) => {
  const result = await BuildPackage.findByIdAndDelete(id);
  return result;
};

export const BuildPackageService = {
  createBuildPackageToDB,
  getAllBuildPackageFromDB,
  getSingleBuildPackageFromDB,
  updateBuildPackageToDB,
  deleteBuildPackageToDB,
};
