import { id } from 'mongodb-typescript';
import { Money } from 'src/common/money';

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

