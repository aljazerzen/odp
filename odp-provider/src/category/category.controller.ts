import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Error } from 'src/common/error.dto';

import { Category } from './category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
@ApiTags('category')
export class CategoryController {

  constructor(
    private categoryService: CategoryService
  ) { }

  @Get(':path')
  @ApiResponse({ type: Category, status: 200 })
  @ApiNotFoundResponse({ type: Error })
  public async getCategory(@Param('path') path: string): Promise<Category> {
    const { resolved, category } = await this.categoryService.resolveCategory(path ?? '');

    const children = await this.categoryService.getChildren([category]);

    return { ...resolved, childrenNames: children.map(c => c.name) };
  }
}