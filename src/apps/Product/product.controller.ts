import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { IUserRequest } from '@config/globals';

import { Ip } from '@utils/interceptors/ip';

import { Product } from './product.entity';
import { ProductService } from './ProductService';
import { validateCreate } from './validator';

@Service()
@JsonController('/products')
export class ProductController {
  @Inject()
  private readonly service!: ProductService;

  @Get('/type/:productTypeId')
  @Authorized()
  async findByType(@Param('productTypeId') id: string) {
    const response = this.service.findByType(id);
    return response;
  }

  @Get('/:id')
  @Authorized()
  async findOne(@Param('id') id: string) {
    const response = this.service.findOne(id);
    return response;
  }

  @Post()
  @Authorized()
  @UseBefore(validateCreate)
  async create(
    @Body() product: Product,
    @Ip() ip: string,
    @CurrentUser() user: IUserRequest
  ) {
    const response = await this.service.create(product, ip, user);
    return response;
  }

  @Put('/:id')
  @Authorized()
  @UseBefore(validateCreate)
  async update(
    @Body() product: Product,
    @Param('id') id: string,
    @Ip() ip: string,
    @CurrentUser() user: IUserRequest
  ) {
    const response = await this.service.update(id, product, ip, user);
    return response;
  }
}
