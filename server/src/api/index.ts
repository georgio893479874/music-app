import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get()
  getApiRoot() {
    return { message: 'Welcome to the API', status: 'OK' };
  }
}