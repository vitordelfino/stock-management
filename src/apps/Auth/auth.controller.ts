import {
  BodyParam,
  JsonController,
  Post,
  UseBefore,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { AuthService } from './AuthService';
import { validateLogin } from './validator';

@Service()
@JsonController('/auth')
export class AuthController {
  @Inject()
  private readonly service!: AuthService;

  @Post()
  @UseBefore(validateLogin)
  async auth(
    @BodyParam('document', { required: true }) document: string,
    @BodyParam('password', { required: true }) password: string
  ) {
    const response = await this.service.auth(document, password);
    return response;
  }
}
