import { Module } from '@nestjs/common';
import * as mongodb from 'nestjs-mongodb';

import { Category } from '../category/category.entity';

const providers = [
  mongodb.forRoot('mongodb://localhost:27017/odp'),
  mongodb.forRepository(Category, 'categories'),
];

@Module({
  providers: providers,
  exports: providers
})
export class DatabaseModule { }