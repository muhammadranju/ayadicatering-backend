import express, { NextFunction, Request, Response } from 'express';
import { SetPackageController } from './setPackage.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
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
  SetPackageController.createSetPackage,
);

router.route('/').get(SetPackageController.getAllSetPackage);
router.route('/:id').get(SetPackageController.getSingleSetPackage);

router.route('/:id').patch(
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  SetPackageController.updateSetPackage,
);

router
  .route('/:id')
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    SetPackageController.deleteSetPackage,
  );

export const SetPackageRoutes = router;
