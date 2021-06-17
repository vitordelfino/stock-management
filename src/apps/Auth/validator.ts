import { NextFunction, Request, Response } from 'express';

import yup from '@config/yup';

export const validateLogin = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await yup
      .object()
      .shape({
        document: yup.string().length(11).required(),
        password: yup.string().required(),
      })
      .validateSync(req.body, { abortEarly: false });

    return next();
  } catch (e) {
    return next(e);
  }
};
