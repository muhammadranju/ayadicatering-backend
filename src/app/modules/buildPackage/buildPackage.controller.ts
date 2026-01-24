import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { BuildPackageService } from './buildPackage.service';
import { IPaginationOptions } from '../../../types/pagination';
import pick from '../../../shared/pick';

const buildPackageController = catchAsync(
  async (req: Request, res: Response, next) => {
    const { ...buildPackageData } = req.body;

    let image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...buildPackageData,
    };
    const result = await BuildPackageService.createBuildPackageToDB(data);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Build Package created successfully',
      data: result,
    });
  },
);

const getAllBuildPackageController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
      'searchTerm',
      'category',
    ]);

    const category = paginationOptions.category;
    const result = await BuildPackageService.getAllBuildPackageFromDB(
      paginationOptions as IPaginationOptions,
      category as string,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Build Package fetched successfully',
      data: result,
    });
  },
);

const getSingleBuildPackageController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BuildPackageService.getSingleBuildPackageFromDB(
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Build Package fetched successfully',
      data: result,
    });
  },
);

const updateBuildPackageController = catchAsync(
  async (req: Request, res: Response) => {
    const { ...buildPackageData } = req.body;
    let image = getSingleFilePath(req.files, 'image');

    const data = {
      ...buildPackageData,
    };

    if (image) {
      data.image = image;
    }

    const result = await BuildPackageService.updateBuildPackageToDB(
      req.params.id as string,
      data,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Build Package updated successfully',
      data: result,
    });
  },
);

const deleteBuildPackageController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BuildPackageService.deleteBuildPackageToDB(
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Build Package deleted successfully',
      data: result,
    });
  },
);

export const BuildPackageController = {
  buildPackageController,
  getAllBuildPackageController,
  getSingleBuildPackageController,
  updateBuildPackageController,
  deleteBuildPackageController,
};
