import { NextFunction, Request, Response } from 'express';
import { CustomError } from 'express-handler-errors';
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers';
import { Service } from 'typedi';
import { ValidationError } from 'yup';

@Middleware({ type: 'after' })
@Service()
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _: Request, response: Response, next: NextFunction) {
    console.log('error', error);
    if (error instanceof CustomError)
      response.status(error.error.status).json(error.getErrorResponse());
    else if (error instanceof ValidationError) {
      response.status(422).json({
        code: 'VALIDATION_ERROR',
        message: 'Erro na validação do payload',
        errors: error.errors,
      });
    } else {
      response.status(500).json({
        code: 'INTERNAL_ERROR',
        message: error.message,
      });
    }
    next();
  }
}
