import { Module } from '@nestjs/common';
import * as mongodb from 'nestjs-mongodb';
import { CategoryModule } from 'src/category/category.module';
import { DatabaseModule } from 'src/common/database.module';

import { OfferController } from './offer.controller';
import { Offer } from './offer.entity';
import { OfferService } from './offer.service';

@Module({
  controllers: [OfferController],
  providers: [
    OfferService,
    mongodb.forRepository(Offer, 'offers'),
  ],
  exports: [
    mongodb.forRepository(Offer, 'offers'),
  ],
  imports: [DatabaseModule, CategoryModule]
})
export class OfferModule {

}