import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  UseBefore,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { Ip } from '@utils/interceptors/ip';

import { IUserRequest } from './../../config/globals';
import { User } from './user.entity';
import { UserService } from './UserService';
import { validateCreate } from './validator';
@JsonController('/users')
@Service()
export class UserController {
  @Inject()
  private service!: UserService;

  // @Post()
  // async create(@Body() user: User) {
  //   const response = await this.service.create(user);
  //   return response;
  // }

  // @Put('/:id')
  // async update(@Body() user: User, @Param('id') id: string) {
  //   const response = await this.service.update(id, user);
  //   return response;
  // }

  @Get()
  @Authorized()
  async index(@CurrentUser() user: IUserRequest) {
    const response = await this.service.findOne(user._id);
    return response;
  }

  @Post('/create-admin')
  @UseBefore(validateCreate)
  async createAdmin(@Body() user: User, @Ip() ip: string) {
    const response = await this.service.createAdmin(user, ip);
    return response;
  }
}
