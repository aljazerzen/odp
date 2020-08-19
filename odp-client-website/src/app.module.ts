import { HttpModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { OfferController } from './offer/offer.controller';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OfferService } from './offer/offer.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, CartController, OfferController, OrderController],
  providers: [CartService, OrderService, OfferService],
})
export class AppModule {}
