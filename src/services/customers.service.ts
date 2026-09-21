import { ICustomersRepository, ICustomersService } from '../interfaces';
import { CreateCustomerDto } from '../dtos/customers/createCustomer.dto';
import { UpdateCustomerDto } from '../dtos/customers/updateCustomer.dto';
import { STATUS_CODES } from '../utils/statusCodes';
import APIError from '../utils/APIError';

export class CustomersService implements ICustomersService {
  constructor(private readonly customersRepo: ICustomersRepository) {}

  async create(dto: CreateCustomerDto) {
    const existing = await this.customersRepo.findByPhone(dto.phone);
    if (existing)
      throw new APIError(
        'A customer with this phone number already exists.',
        STATUS_CODES.Conflict,
      );

    const customer = await this.customersRepo.create(dto);

    return { statusCode: STATUS_CODES.Created, data: customer };
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.checkExistingCustomerById(id);

    if (dto.phone && dto.phone !== customer.phone) {
      const phoneInUse = await this.customersRepo.findByPhone(dto.phone);
      if (phoneInUse)
        throw new APIError(
          'A customer with this phone number already exists.',
          STATUS_CODES.Conflict,
        );
    }

    const updated = await this.customersRepo.update(id, dto);

    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async findByPhone(phone: string) {
    const customer = await this.checkExistingCustomerByPhone(phone);

    return { statusCode: STATUS_CODES.OK, data: customer };
  }

  // ---- Helpers ----
  async checkExistingCustomerByPhone(phone: string) {
    const customer = await this.customersRepo.findByPhone(phone);
    if (!customer)
      throw new APIError(
        'No customer found with this phone number.',
        STATUS_CODES.NotFound,
      );

    return customer;
  }

  async checkExistingCustomerById(id: string) {
    const customer = await this.customersRepo.findById(id);
    if (!customer)
      throw new APIError(
        'No customer found with this id.',
        STATUS_CODES.NotFound,
      );

    return customer;
  }
}
