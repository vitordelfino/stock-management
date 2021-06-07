import { createParamDecorator } from 'routing-controllers';

export const Ip = () =>
  createParamDecorator({
    value: (action) => action.request.fromIp,
  });
