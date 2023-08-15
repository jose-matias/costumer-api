import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@auth/auth.module';
import { RedisModule } from '@config/cache/redis.module';
import { CustomerModule } from '@modules/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    RedisModule,
    CustomerModule,
  ],
})
export class AppModule { }
