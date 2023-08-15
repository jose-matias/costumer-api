import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from '@auth/auth.module';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: CustomerService;

  beforeAll(async () => {
    process.env = {
      KEYCLOAK_BASE_URL: 'base_url',
      KEYCLOAK_REALM: 'realm',
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [CustomerController],
      providers: [
        CustomerService,
        {
          provide: CustomerService,
          useFactory: () => ({
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
          })
        }
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerService = module.get<CustomerService>(CustomerService);
  })

  it('Calling create method', () => {
    const createCustomerDto = new CreateCustomerDto();

    customerController.create(createCustomerDto);

    expect(customerService.create).toHaveBeenCalled();
    expect(customerService.create).toHaveBeenCalledWith(createCustomerDto);
  })

  it('Calling getById method', () => {
    customerController.getById('uuid');
    expect(customerService.getById).toHaveBeenCalled();
  })

  it('Calling update method', () => {
    const updateCustomerDto = new UpdateCustomerDto();

    customerController.update('uuid', updateCustomerDto);

    expect(customerService.update).toHaveBeenCalled();
    expect(customerService.create).toHaveBeenCalledWith(updateCustomerDto);
  })
});

