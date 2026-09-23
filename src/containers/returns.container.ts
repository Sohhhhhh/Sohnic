import {
  inspectionsRepository,
  returnsRepository,
} from './repositories.container';
import { ReturnsService } from '../services/returns.service';
import { ReturnsController } from '../controllers/returns.controller';

// ----- Services -----

export const returnsSrevice = new ReturnsService(
  returnsRepository,
  inspectionsRepository,
);

// ----- Controllers -----

export const returnsController = new ReturnsController(returnsSrevice);
