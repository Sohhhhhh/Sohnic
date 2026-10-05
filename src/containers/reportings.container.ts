import {
  salesRepository,
  usersRepository,
  branchesRepository,
  purchaseOrdersRepository,
  manufacturingOrdersRepository,
} from './repositories.container';
import { ReportingsService } from '../services/reportings.service';

// ----- Services -----

export const reportingsService = new ReportingsService(
  salesRepository,
  usersRepository,
  branchesRepository,
  purchaseOrdersRepository,
  manufacturingOrdersRepository,
);
