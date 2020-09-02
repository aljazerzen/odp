import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';

import { OdpModule } from '../odp/odp.module';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  controllers: [OfferController],
  providers: [OfferService],
  exports: [],
  imports: [CategoryModule, OdpModule]
})
export class OfferModule {

}