import { Injectable } from '@nestjs/common';
import { Offer } from 'offer/offer.entity';
import { Money } from 'src/common/money';
import { moneyAggregate, moneyMultiply } from 'src/money-util';

import { ObjectId } from '../src/offer/node_modules/mongodb';
import { Repository } from '../src/offer/node_modules/mongodb-typescript';
import { InjectRepo } from '../src/offer/node_modules/nestjs-mongodb';
import { OrderDTO, OrderItemDTO } from './order.dto';
import { Order, OrderItem, OrderStatus } from './order.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepo(Order) private orderRepo: Repository<Order>,
    @InjectRepo(Offer) private offerRepo: Repository<Offer>,
  ) { }

  async createItem(i: OrderItemDTO): Promise<OrderItem> {
    const item = new OrderItem();
    item.amount = i.amount;

    let id: ObjectId;
    try {
      id = ObjectId.createFromHexString(i.offerId ?? null);
    } catch (e) {
      return item;
    }

    const offer = await this.offerRepo.findById(id)
    if (offer) item.offer = offer;
    return item;
  }

  public toDto(entity: Order): OrderDTO {
    return {
      id: entity.id.toHexString(),
      items: entity.items.map(i => ({
        amount: i.amount,
        offerId: (i.offer?.id ?? (i as any).offerId as ObjectId).toHexString()
      })),
      price: entity.price,
      status: entity.status
    };
  }

  async quote(orderId: ObjectId) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) return;

    await this.offerRepo.populateMany(order.items, 'offer');

    order.status = OrderStatus.COMMIT;

    order.price = moneyAggregate(order.items.map(i => moneyMultiply(i.amount)(i.offer?.price ?? null)));

    this.orderRepo.save(order);
  }

  async requestPre(orderId: ObjectId) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) return;

    order.status = OrderStatus.PRE_SELECT;

    order.prePayment = {
      money: order.price.map(moneyMultiply(0.5)).filter(m => !!m) as Money[],
      availableMethods: [
        'iban://BSLJSI2XXXX/SI56192001234567892#SI1200054',
        'btc://#1GVY5eZvtc5bA6EFEGnpqJeHUC5YaV5dsb'
      ]
    };

    this.orderRepo.save(order);
  }

  async acceptPrePayment(orderId: ObjectId) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) return;

    order.status = OrderStatus.ISSUE;

    this.orderRepo.save(order);

    // schedule order issuing in 3 sec
    setTimeout(() => this.issue(order.id), 1000 * 3);
  }

  async issue(orderId: ObjectId) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) return;

    order.status = OrderStatus.CONFIRM;

    this.orderRepo.save(order);
  }

  async requestPost(orderId: ObjectId) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) return;

    order.status = OrderStatus.POST_SELECT;

    order.postPayment = {
      money: order.price.map(moneyMultiply(0.5)).filter(m => !!m) as Money[],
      availableMethods: [
        'iban://BSLJSI2XXXX/SI56192001234567892#SI1200054',
        'btc://#1GVY5eZvtc5bA6EFEGnpqJeHUC5YaV5dsb'
      ]
    };

    this.orderRepo.save(order);
  }

  async acceptPostPayment(orderId: ObjectId) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) return;

    order.status = OrderStatus.DONE;

    this.orderRepo.save(order);
  }
}