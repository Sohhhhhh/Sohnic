import { categoriesRepository } from './repositories.container';
import { CategoriesService } from '../services/categories.service';
import { CategoriesController } from '../controllers/categories.controller';

// ----- Services -----

export const categoriesService = new CategoriesService(categoriesRepository);

// ----- Controllers -----

export const categoriesController = new CategoriesController(categoriesService);
