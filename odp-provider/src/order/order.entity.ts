import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { id, nested, ref } from 'mongodb-typescript';
import { Money } from 'src/common/money';
import { OfferEntity } from 'src/offer/offer.entity';

export class OrderItemEntity {
  @ref() offer: OfferEntity;

  amount: number;
}

export class OrderEntity {
  @id id: ObjectId;

  @nested(() => OrderItemEntity) items: OrderItemEntity[];

  price: Money[];

  status: OrderStatus;

  prePayment?: PaymentRequest;
  postPayment?: PaymentRequest;
}

export enum OrderStatus {
  QUOTE = 'QUOTE',
  COMMIT = 'COMMIT',
  PRE_REQUEST = 'PRE_REQUEST',
  PRE_SELECT = 'PRE_SELECT',
  PRE_PROVIDE = 'PRE_PROVIDE',
  ISSUE = 'ISSUE',
  CONFIRM = 'CONFIRM',
  POST_REQUEST = 'POST_REQUEST',
  POST_SELECT = 'POST_SELECT',
  POST_PROVIDE = 'POST_PROVIDE',
  RATE = 'RATE',
  DONE = 'DONE',
  CANCEL = 'CANCEL',
}

export class PaymentRequest {
  @ApiProperty({ type: Money, isArray: true })
  money: Money[];
  @ApiProperty({ type: 'string', isArray: true })
  availableMethods: string[];
  @ApiProperty({ type: 'string', required: false })
  selectedMethod?: string;
}

export class PaymentMethodSelection {
  @ApiProperty({ type: 'string', required: false })
  selectedMethod?: string;
}
