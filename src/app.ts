import { createNamespace, Namespace } from 'continuation-local-storage';
import cors from 'cors';
import express, {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { CustomError } from 'express-handler-errors';
import reqId from 'express-request-id';
import { verify } from 'jsonwebtoken';
import morgan from 'morgan-body';
import { resolve } from 'path';
import { Action, useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';

import { auth } from '@config/globals';

import logger from '@middlewares/logger';
class App {
  public readonly app: Application;
  private readonly session: Namespace;

  constructor() {
    this.app = express();
    this.session = createNamespace('session');
    this.middlewares();
    // this.errorHandle();
    useContainer(Container);
    useExpressServer(this.app, {
      routePrefix: '/api',
      classTransformer: false,
      defaultErrorHandler: false,
      controllers: [
        resolve(__dirname, './apps/**/*.controller.ts'),
        resolve(__dirname, './apps/**/*.controller.js'),
      ],
      middlewares: [
        resolve(__dirname, './middlewares/api/*.ts'),
        resolve(__dirname, './middlewares/api/*.js'),
      ],
      authorizationChecker: (action: Action) => {
        const token = action.request.headers.authorization;
        if (!token)
          if (action.next)
            return action.next(
              new CustomError({
                code: 'UNAUTHORIZED',
                message: 'Token inválido',
                status: 401,
              })
            );
          else return false;

        try {
          const user = verify(token, auth.secret);
          action.request.user = user;
          return true;
        } catch (e) {
          if (action.next)
            return action.next(
              new CustomError({
                code: 'UNAUTHORIZED',
                message: 'Token inválido',
                status: 401,
              })
            );
          else return false;
        }
      },
      currentUserChecker: (action: Action) => {
        return action.request.user;
      },
    });
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(reqId());
    const attachContext: RequestHandler = (
      _: Request,
      __: Response,
      next: NextFunction
    ) => {
      this.session.run(() => {
        next();
      });
    };

    const setRequestId: RequestHandler = (
      request: Request,
      _: Response,
      next: NextFunction
    ) => {
      this.session.set('id', request.id);
      next();
    };

    this.app.use(attachContext, setRequestId);
    morgan(this.app, {
      noColors: true,
      prettify: false,
      logReqUserAgent: false,
      stream: {
        write: (msg: string) => logger.info(msg) as any,
      },
    });
  }
}

export default new App().app;
