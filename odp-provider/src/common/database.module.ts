import { Module } from '@nestjs/common';
import * as mongodb from 'nestjs-mongodb';

import { CategoryEntity } from '../category/category.entity';

const providers = [
  mongodb.forRoot('mongodb://localhost:27017/odp'),
  mongodb.forRepository(CategoryEntity, 'categories'),
];

@Module({
  providers,
  exports: providers
})
export class DatabaseModule { }