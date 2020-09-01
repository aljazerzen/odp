import { Money } from 'src/common/money';

import { id } from '../src/offer/node_modules/mongodb-typescript';
import { OrderStatus, PaymentRequest } from './order.entity';

export class OrderDTO {
  id: string;

  status: OrderStatus;

  items: OrderItemDTO[];

  price?: Money[];

  prePayment?: PaymentRequest;
  postPayment?: PaymentRequest;
}

export class OrderItemDTO {
  offerId: string;
  amount: number;
}

