import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { RedisService } from '@config/cache/redis.service';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './interface/customer.interface';

@Injectable()
export class CustomerService {
  constructor(private readonly redisService: RedisService) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const id = uuidv4();
    const customerKey = 'customer:' + id;

    createCustomerDto.id = id;

    await this.redisService.set(customerKey, JSON.stringify(createCustomerDto));
    const customer = await this.redisService.get(customerKey);

    return JSON.parse(customer);
  }

  async getById(id: string): Promise<Customer> {
    const customerKey = 'customer:' + id;
    const customerValue = await this.redisService.get(customerKey);

    if (!customerValue) {
      throw new NotFoundException('Customer not found');
    }

    return JSON.parse(customerValue);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.getById(id);

    if (customer.id !== updateCustomerDto.id) {
      throw new ConflictException('Customer id conflict');
    }

    const customerKey = 'customer:' + id;

    await this.redisService.set(customerKey, JSON.stringify(updateCustomerDto));
    const customerUpdated = await this.redisService.get(customerKey);

    return JSON.parse(customerUpdated);
  }
}
