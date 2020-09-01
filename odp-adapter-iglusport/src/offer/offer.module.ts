import { HttpModule, Module } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';

import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  controllers: [OfferController],
  providers: [
    OfferService,
  ],
  exports: [],
  imports: [CategoryModule, HttpModule]
})
export class OfferModule {

}