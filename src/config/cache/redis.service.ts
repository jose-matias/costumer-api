import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  public constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.getOrThrow('REDIS_HOST'),
      port: this.configService.getOrThrow('REDIS_PORT'),
    });
  }

  async set(key: string, value: string) {
    try {
      await this.redisClient.set(key, value);
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      throw new BadGatewayException();
    }
  }
}
