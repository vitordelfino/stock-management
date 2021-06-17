import { NextFunction, Request, Response } from 'express';

import yup from '@config/yup';

export const validateCreate = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await yup
      .object()
      .shape({
        name: yup.string().required(),
        description: yup.string(),
      })
      .validateSync(req.body, { abortEarly: false });

    return next();
  } catch (e) {
    return next(e);
  }
};
