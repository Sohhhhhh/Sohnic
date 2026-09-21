import { sendResponse } from '../utils/sendResponse';
import { ICustomersService } from '../interfaces/services';
import {
  createCustomerValidatedCtrlr,
  findCustomerByPhoneValidatedCtrlr,
  updateCustomerValidatedCtrlr,
} from '../validators/customers.validator';
import {
  CombinedValidator,
  idValidatedCtrlr,
} from '../validators/common.validator';

export class CustomersController {
  constructor(private readonly customersService: ICustomersService) {}

  create: createCustomerValidatedCtrlr = async (req, res) => {
    const result = await this.customersService.create(req.body);
    sendResponse(res, result);
  };

  update: CombinedValidator<idValidatedCtrlr, updateCustomerValidatedCtrlr> =
    async (req, res) => {
      const { id } = req.params;
      const result = await this.customersService.update(id, req.body);
      sendResponse(res, result);
    };

  findByPhone: findCustomerByPhoneValidatedCtrlr = async (req, res) => {
    const { phone } = req.query;
    const result = await this.customersService.findByPhone(phone);
    sendResponse(res, result);
  };
}
