import { Module } from '@nestjs/common';

import { CategoryModule } from './category/category.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [CategoryModule, OfferModule]
})
export class AppModule {}
