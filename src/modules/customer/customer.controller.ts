import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@auth/auth.guard';

import { Customer } from './interface/customer.interface';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@UseGuards(AuthGuard)
@Controller('customers')
export class CustomerController {

  constructor(
    @Inject(CustomerService)
    private readonly customerService: CustomerService,
  ) { }

  @Post()
  public create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @Get(':id')
  public getById(@Param('id') id: string): Promise<Customer> {
    return this.customerService.getById(id);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.customerService.update(id, updateCustomerDto);
  }
}
