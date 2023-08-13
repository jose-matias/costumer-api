import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule { }
