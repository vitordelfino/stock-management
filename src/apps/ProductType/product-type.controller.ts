import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  UseBefore,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { IUserRequest } from '@config/globals';

import { Ip } from '@utils/interceptors/ip';

import { ProductType } from './product-type.entity';
import { ProductTypeService } from './ProductTypeService';
import { validateCreate } from './validator';

@Service()
@JsonController('/product-type')
export class ProductTypeController {
  @Inject()
  private readonly service!: ProductTypeService;

  @Get()
  @Authorized()
  async list() {
    const response = await this.service.list();
    return response;
  }

  @Get('/:id')
  @Authorized()
  async findOne(@Param('id') id: string) {
    const response = await this.service.findOne(id);
    return response;
  }

  @Post()
  @Authorized()
  @UseBefore(validateCreate)
  async create(
    @Body() productType: ProductType,
    @Ip() ip: string,
    @CurrentUser() user: IUserRequest
  ) {
    const response = await this.service.create(productType, ip, user);
    return response;
  }
}
