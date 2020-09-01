import { Module } from '@nestjs/common';
import { OfferModule } from 'offer/offer.module';
import { DatabaseModule } from 'src/common/database.module';

import * as nestjsMongodb from '../src/offer/node_modules/nestjs-mongodb';
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
