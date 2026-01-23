import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import sendResponse from './shared/sendResponse';
import compression from 'compression';
const app = express();

app.use(
  compression({
    level: 6,
    threshold: 10 * 1000,
    filter: (req, res) => {
      if (req.headers['accept-encoding']?.includes('br')) {
        return true;
      }
      return false;
    },
  }),
);

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//body parser
app.use(
  cors({
    origin: [
      'https://www.ayadicatering.com',
      'https://ayadicatering.com',

      'http://localhost:3000',
      'http://localhost:3001',
      'http://10.10.7.101:3000',
      'http://10.10.7.101:3001',
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);

//live response
app.get('/', (req: Request, res: Response) => {
  const date = new Date(Date.now());
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Beep-beep! The server is alive and kicking.',
    data: date,
  });
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
  sendResponse(res, {
    success: false,
    statusCode: StatusCodes.NOT_FOUND,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
