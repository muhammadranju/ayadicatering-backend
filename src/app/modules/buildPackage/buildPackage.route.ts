import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { BuildPackageController } from './buildPackage.controller';
import { createBuildPackageValidation } from './buildPackage.validation';
const router = express.Router();

router.route('/').post(
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(createBuildPackageValidation),
  BuildPackageController.buildPackageController,
);
router.route('/').get(BuildPackageController.getAllBuildPackageController);

router
  .route('/:id')
  .get(BuildPackageController.getSingleBuildPackageController);

router.route('/:id').patch(
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(createBuildPackageValidation),
  BuildPackageController.updateBuildPackageController,
);

router
  .route('/:id')
  .delete(BuildPackageController.deleteBuildPackageController);

export const BuildPackageRoutes = router;
