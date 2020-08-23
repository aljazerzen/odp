import { ApiProperty } from '@nestjs/swagger';
import { id } from 'mongodb-typescript';
import { Money } from 'src/common/money';

import { OrderStatus, PaymentRequest } from './order.entity';

export class OrderItem {
  @ApiProperty()
  offerId: string;
  @ApiProperty({ type: 'integer' })
  amount: number;
}
export class Order {
  @ApiProperty({ required: false })
  id: string;

  @ApiProperty({ required: false, enum: Object.values(OrderStatus), enumName: 'OrderStatus' })
  status: OrderStatus;

  @ApiProperty({ required: false, type: OrderItem, isArray: true })
  items: OrderItem[];

  @ApiProperty({ required: false })
  price?: Money[];

  @ApiProperty({ required: false })
  prePayment?: PaymentRequest;

  @ApiProperty({ required: false })
  postPayment?: PaymentRequest;
}

