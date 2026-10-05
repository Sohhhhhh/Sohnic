import cron from 'node-cron';
import { reportingsService } from '../containers/reportings.container';

// monthly
cron.schedule('0 0 1 * *', () => reportingsService.generateMonthlyReport(), {
  name: 'monthly-report',
});

// annually
cron.schedule('0 0 1 1 *', () => reportingsService.generateAnnualReport(), {
  name: 'annual-report',
});
