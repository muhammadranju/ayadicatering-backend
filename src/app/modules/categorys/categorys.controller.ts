import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './categorys.service';
import { getSingleFilePath } from '../../../shared/getFilePath';
import pick from '../../../shared/pick';
import { IPaginationOptions } from '../../../types/pagination';

const categoryController = catchAsync(async (req: Request, res: Response) => {
  const { ...categoryData } = req.body;

  let image = getSingleFilePath(req.files, 'image');

  const data = {
    image,
    ...categoryData,
  };

  const result = await CategoryService.createCategoryToDB(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
    ]);
    const result = await CategoryService.getAllCategoryFromDB(
      paginationOptions as IPaginationOptions,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category fetched successfully',
      data: result,
    });
  },
);

const getSingleCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.getSingleCategoryFromDB(
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category fetched successfully',
      data: result,
    });
  },
);

const updateCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const { ...categoryData } = req.body;
    let image = getSingleFilePath(req.files, 'image');

    const data = {
      ...categoryData,
    };

    if (image) {
      data.image = image;
    }

    const result = await CategoryService.updateCategoryToDB(
      req.params.id as string,
      data,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
  },
);

const deleteCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.deleteCategoryToDB(
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category deleted successfully',
      data: result,
    });
  },
);

export const CategoryController = {
  categoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
