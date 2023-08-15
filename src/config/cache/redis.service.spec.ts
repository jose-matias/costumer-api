import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { RedisService } from './redis.service';
import { BadGatewayException } from '@nestjs/common';

describe('RedisService', () => {
  let redisService: RedisService;

  beforeEach(async () => {
    process.env = {
      REDIS_HOST: 'redis',
      REDIS_PORT: '6379',
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [RedisService],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
  });

  it('Should be defined', () => {
    expect(redisService).toBeDefined();
  });

  describe('set', () => {
    it('Should set a new register with success', async () => {
      jest.spyOn(redisService, 'set').mockResolvedValueOnce('OK');

      const result = await redisService.set('key', 'value');

      expect(result).toBeDefined();
      expect(redisService.set).toBeCalledTimes(1);
      expect(result).toBe('OK');
    });

    it('Throw bad gateway exception if Redis not working', async () => {
      jest.spyOn(redisService, 'set').mockRejectedValueOnce(new BadGatewayException());

      expect(redisService.set('key', 'value')).rejects.toThrow(BadGatewayException);
    });
  });

  describe('get', () => {
    it('Should get a new register with success', async () => {
      const entityMock = JSON.stringify({ key: 'key', value: 'value' });

      jest.spyOn(redisService, 'get').mockResolvedValueOnce('value');

      const result = await redisService.get('key');

      expect(result).toBeDefined();
      expect(redisService.get).toBeCalledTimes(1);
      expect(result).toBe('value');
    });

    it('Throw bad gateway exception if Redis not working', async () => {
      jest.spyOn(redisService, 'get').mockRejectedValueOnce(new BadGatewayException());

      expect(redisService.get('key')).rejects.toThrow(BadGatewayException);
    });
  });
});
