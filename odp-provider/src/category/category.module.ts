import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database.module';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [DatabaseModule],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService]
})
export class CategoryModule {}
