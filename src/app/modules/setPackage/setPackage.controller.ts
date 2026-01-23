import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { IPaginationOptions } from '../../../types/pagination';
import { SetPackageService } from './setPackage.service';

const createSetPackage = catchAsync(async (req: Request, res: Response) => {
  const { ...body } = req.body;

  let image = getSingleFilePath(req.files, 'image');

  const data = {
    image,
    ...body,
  };

  const result = await SetPackageService.createSetPackage(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getAllSetPackage = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);

  const result = await SetPackageService.getAllSetPackage(
    paginationOptions as IPaginationOptions,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getSingleSetPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await SetPackageService.getSingleSetPackage(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const updateSetPackage = catchAsync(async (req: Request, res: Response) => {
  const { ...body } = req.body;

  let image = getSingleFilePath(req.files, 'image');

  const data = {
    image,
    ...body,
  };

  const result = await SetPackageService.updateSetPackage(
    req.params.id as string,
    data,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const deleteSetPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await SetPackageService.deleteSetPackage(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

export const SetPackageController = {
  createSetPackage,
  getAllSetPackage,
  getSingleSetPackage,
  updateSetPackage,
  deleteSetPackage,
};
