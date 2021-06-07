import { NextFunction, Request, Response } from 'express';

import yup from '@config/yup';

export const validateCreate = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  await yup
    .object()
    .shape({
      name: yup.string().required(),
      document: yup.string().length(11).required(),
      password: yup.string().required(),
    })
    .validateSync(req.body, { abortEarly: false });

  return next();
};
