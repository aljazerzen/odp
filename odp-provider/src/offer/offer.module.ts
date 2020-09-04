import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';
import { DatabaseModule, forRepository } from 'src/common/database.module';

import { OfferController } from './offer.controller';
import { OfferEntity } from './offer.entity';
import { OfferService } from './offer.service';

@Module({
  controllers: [OfferController],
  providers: [
    OfferService,
    forRepository(OfferEntity, 'offers'),
  ],
  exports: [
    forRepository(OfferEntity, 'offers'),
  ],
  imports: [DatabaseModule, CategoryModule]
})
export class OfferModule {

}