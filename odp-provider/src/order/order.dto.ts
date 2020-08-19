import { id } from 'mongodb-typescript';
import { Money } from 'src/common/money';

import { OrderStatus } from './order.entity';

export class OrderDTO {
  id: string;

  items: OrderItemDTO[];

  price: Money[];

  status: OrderStatus;
}

export class OrderItemDTO {
  offerId: string;
  amount: number;
}
