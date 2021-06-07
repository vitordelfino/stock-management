import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';

@Middleware({ type: 'before' })
@Service()
export class GetIp implements ExpressMiddlewareInterface {
  use(request: Request, _: Response, next: NextFunction) {
    const possibleIp = request.headers['x-forwarded-for'];
    const ip =
      typeof possibleIp === 'string'
        ? possibleIp
        : Array.isArray(possibleIp)
        ? possibleIp.shift() ?? 'unknow'
        : 'unknow';
    request.fromIp = ip;

    next();
  }
}
