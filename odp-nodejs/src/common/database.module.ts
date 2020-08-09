import { Module } from '@nestjs/common';
import * as mongodb from 'nestjs-mongodb';

import { Category } from '../models/category.entity';
import { Offer } from '../models/offer.entity';

const providers = [
  mongodb.forRoot('localhost'),
  mongodb.forRepository(Offer),
  mongodb.forRepository(Category),
];

@Module({
  providers: providers,
  exports: providers
})
export class DatabaseModule { }