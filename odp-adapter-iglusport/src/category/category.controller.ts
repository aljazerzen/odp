import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { Category } from './category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {

  constructor(
    private categoryService: CategoryService,
  ) { }

  @Get(':path')
  public async getCategory(@Param('path') path: string): Promise<Category> {
    const category = await this.categoryService.resolveCategory(path ?? '');

    if (!category) throw new NotFoundException('CATEGORY_NOT_FOUND');
    return category;
  }
}