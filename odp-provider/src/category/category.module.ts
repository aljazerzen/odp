import { Module } from '@nestjs/common';

import { DatabaseModule, forRepository } from '../common/database.module';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    CategoryService,
    forRepository(CategoryEntity, 'categories'),
  ],
  controllers: [CategoryController],
  exports: [CategoryService]
})
export class CategoryModule {}
