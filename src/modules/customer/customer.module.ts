import { Module } from '@nestjs/common';

import { RedisModule } from '@config/cache/redis.module';

import { AuthModule } from '@auth/auth.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [RedisModule, AuthModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule { }
