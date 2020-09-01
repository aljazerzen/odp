import { Offer } from 'offer/offer.entity';
import { Money } from 'src/common/money';

import { ObjectId } from '../src/offer/node_modules/mongodb';
import { id, nested, ref } from '../src/offer/node_modules/mongodb-typescript';

export class OrderItem {
  @ref() offer: Offer;

  amount: number;
}

export class Order {
  @id id: ObjectId;

  @nested(() => OrderItem) items: OrderItem[];

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
  money: Money[];
  availableMethods: string[];
  selectedMethod?: string;
}
