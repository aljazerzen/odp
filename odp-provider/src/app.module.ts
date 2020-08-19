import { Module } from '@nestjs/common';

import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './common/database.module';
import { OfferModule } from './offer/offer.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [CategoryModule, DatabaseModule, OfferModule, OrderModule]
})
export class AppModule {}
