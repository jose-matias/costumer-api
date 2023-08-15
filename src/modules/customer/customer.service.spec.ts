/* eslint-disable no-undef */
import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing';

import { RedisModule } from '@config/cache/redis.module';
import { RedisService } from '@config/cache/redis.service';

import { CustomerService } from './customer.service';
import { Customer } from './interface/customer.interface';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerService', function () {
  let customerService: CustomerService;
  let redisService: RedisService;

  beforeEach(async () => {
    process.env = {
      REDIS_HOST: 'redis',
      REDIS_PORT: '6379',
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [CustomerService],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('Should be defined', () => {
    expect(customerService).toBeDefined();
    expect(redisService).toBeDefined();
  });

  describe('create', () => {
    it('Should create a new customer with success', async () => {
      const customerData: CreateCustomerDto = {
        name: 'Customer Name',
        document: 1234565789,
      };

      const customerEntityMock = JSON.stringify({
        id: 'uuid',
        document: 1234565789,
        name: 'Customer Name',
      });

      jest.spyOn(redisService, 'set').mockResolvedValueOnce('OK');
      jest.spyOn(redisService, 'get').mockResolvedValueOnce(customerEntityMock);

      const result = await customerService.create(customerData);

      expect(result.id).toBeDefined();
      expect(redisService.set).toBeCalledTimes(1);
      expect(result.name).toBe(customerData.name);
      expect(result.document).toBe(customerData.document);
    });
  });

  describe('getById', () => {
    it('Should return a customer with success', async () => {
      const customer: Customer = {
        id: 'uuid',
        name: 'CustomerName',
        document: 132456789,
      };

      const customerEntityMock = JSON.stringify(customer);

      jest.spyOn(redisService, 'get').mockResolvedValueOnce(customerEntityMock);

      const result = await customerService.getById('uuid');

      expect(result).toBeDefined();
      expect(redisService.get).toBeCalledTimes(1);
      expect(result.id).toBe(customer.id);
      expect(result.name).toBe(customer.name);
      expect(result.document).toBe(customer.document);
    });

    it('Should throw exception not found if client is not found', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);

      expect(customerService.getById('uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('Should update a customer with success', async () => {
      const userData: UpdateCustomerDto = {
        id: 'uuid',
        document: 987654321,
        name: 'Customer New Name',
      };

      const oldCustomerEntityMock: Customer = {
        id: 'uuid',
        document: 132456789,
        name: 'Customer Old Name',
      };

      const newCustomerEntityMock = JSON.stringify(userData);

      jest.spyOn(customerService, 'getById').mockResolvedValueOnce(oldCustomerEntityMock);
      jest.spyOn(redisService, 'set').mockResolvedValueOnce('OK');
      jest.spyOn(redisService, 'get').mockResolvedValueOnce(newCustomerEntityMock);

      const result = await customerService.update(userData.id, userData);

      expect(result.id).toBeDefined();
      expect(customerService.getById).toBeCalledTimes(1);
      expect(redisService.set).toBeCalledTimes(1);
      expect(redisService.get).toBeCalledTimes(1);
      expect(result.name).toBe(userData.name);
      expect(result.document).toBe(userData.document);
    });

    it('Should throw conflict exception if user already exists', async () => {
      const userData: UpdateCustomerDto = {
        id: 'uuid',
        document: 1234565789,
        name: 'Customer Name',
      };

      const customerEntityMock: Customer = {
        id: 'uuid-1',
        document: 132456789,
        name: 'Customer Other Name',
      };

      jest.spyOn(customerService, 'getById').mockResolvedValueOnce(customerEntityMock);

      expect(customerService.update(userData.id, userData)).rejects.toThrow(ConflictException);
    });
  });
});
