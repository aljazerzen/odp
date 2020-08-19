import { Controller, Get, Param } from '@nestjs/common';

import { CategoryService } from './category.service';
import { CategoryDTO } from './resolved-category.dto';

@Controller('categories')
export class CategoryController {

  constructor(
    private categoryService: CategoryService
  ) { }

  @Get(':path')
  public async getCategory(@Param('path') path: string): Promise<CategoryDTO> {
    const { resolved, category } = await this.categoryService.resolveCategory(path ?? '');

    const children = await this.categoryService.getChildren([category]);

    return { ...resolved, childrenNames: children.map(c => c.name) };
  }
}