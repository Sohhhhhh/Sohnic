import {
  IBranchesRepository,
  IManufacturingOrdersRepository,
  IPurchaseOrdersRepository,
  IReportingsService,
  ISalesRepository,
  IUsersRepository,
} from '../interfaces';
import { Branch } from '../types/app.types';
import { sendReportEmail } from '../utils/sendEmail';

export class ReportingsService implements IReportingsService {
  constructor(
    private readonly salesRepo: ISalesRepository,
    private readonly usersRepo: IUsersRepository,
    private readonly branchesRepo: IBranchesRepository,
    private readonly purchaseOrdersRepo: IPurchaseOrdersRepository,
    private readonly manufacturingOrdersRepo: IManufacturingOrdersRepository,
  ) {}

  generateMonthlyReport() {
    return this.sendReports('monthly');
  }

  generateAnnualReport() {
    return this.sendReports('annual');
  }

  // --- Helpers ---
  private async sendReports(type: 'monthly' | 'annual') {
    const { from, to, label } = this.getPeriod(type);
    const [branches, admins] = await Promise.all([
      this.branchesRepo.getAll(),
      this.usersRepo.findByRoles(['super_admin', 'branch_admin']),
    ]);

    const reports = await Promise.all(
      branches.map((b) => this.buildBranchReport(b, from, to)),
    );

    for (const admin of admins) {
      const own =
        admin.role.role === 'super_admin'
          ? reports
          : reports.filter((r) => r.branch.id === admin.branchId);

      await sendReportEmail(admin.email, `${type} report - ${label}`, own);
    }
  }

  private async buildBranchReport(branch: Branch, from: Date, to: Date) {
    const [revenue, cogs, poExpenses, mfgCosts, topItems, byCustomerType] =
      await Promise.all([
        this.salesRepo.getTotalRevenue(branch.id, from, to),
        this.salesRepo.getCOGS(branch.id, from, to),
        this.purchaseOrdersRepo.getTotalExpenses(branch.id, from, to),
        branch.type === 'main'
          ? this.manufacturingOrdersRepo.getManufacturingCosts(from, to)
          : 0,
        this.salesRepo.getTopItems(branch.id, from, to),
        this.salesRepo.getSalesByCustomerType(branch.id, from, to),
      ]);

    const expenses = poExpenses + mfgCosts;

    return {
      branch,
      revenue,
      cogs,
      grossProfit: revenue - cogs,
      expenses,
      topItems,
      byCustomerType,
    };
  }

  private getPeriod(type: 'monthly' | 'annual') {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

    return type === 'monthly'
      ? {
          from: new Date(y, m - 1, 1),
          to: new Date(y, m, 0, 23, 59, 59, 999),
          label: new Date(y, m - 1, 1).toLocaleString('en', {
            month: 'long',
            year: 'numeric',
          }),
        }
      : {
          from: new Date(y - 1, 0, 1),
          to: new Date(y, 0, 0, 23, 59, 59, 999),
          label: String(y - 1),
        };
  }
}
