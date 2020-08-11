import { Module } from '@nestjs/common';

import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './common/database.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [CategoryModule, DatabaseModule, OfferModule]
})
export class AppModule {}
