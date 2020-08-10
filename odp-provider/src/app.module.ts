import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './common/database.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [CategoryModule, DatabaseModule, OfferModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
