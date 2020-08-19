import { ObjectId } from 'mongodb';
import { id, nested, ref } from 'mongodb-typescript';
import { Money } from 'src/common/money';
import { Offer } from 'src/offer/offer.entity';

export class OrderItem {
  @ref() offer: Offer;

  amount: number;
}

export class Order {
  @id id: ObjectId;

  @nested(() => OrderItem) items: OrderItem[];

  price: Money[];

  status: OrderStatus;
}

export enum OrderStatus {
  QUOTE = 'QUOTE',
  COMMIT = 'COMMIT',
  REQUEST_PRE = 'REQUEST_PRE',
  PROVIDE_PRE = 'PROVIDE_PRE',
  ISSUE = 'ISSUE',
  CONFIRM = 'CONFIRM',
  REQUEST_POST = 'REQUEST_POST',
  PROVIDE_POST = 'PROVIDE_POST',
  RATE = 'RATE',
  DONE = 'DONE',
  CANCEL = 'CANCEL',
}