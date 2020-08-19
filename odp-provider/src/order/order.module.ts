import { Module } from '@nestjs/common';
import * as nestjsMongodb from 'nestjs-mongodb';
import { DatabaseModule } from 'src/common/database.module';
import { OfferModule } from 'src/offer/offer.module';

import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [DatabaseModule, OfferModule],
  providers: [
    OrderService,
    nestjsMongodb.forRepository(Order, 'orders')
  ],
  controllers: [OrderController],
  exports: []
})
export class OrderModule { }
