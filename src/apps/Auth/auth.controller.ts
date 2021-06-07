import { BodyParam, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { AuthService } from './AuthService';

@Service()
@JsonController('/auth')
export class AuthController {
  @Inject()
  private readonly service!: AuthService;

  @Post()
  async auth(
    @BodyParam('document', { required: true }) document: string,
    @BodyParam('password', { required: true }) password: string
  ) {
    const response = await this.service.auth(document, password);
    return response;
  }
}
