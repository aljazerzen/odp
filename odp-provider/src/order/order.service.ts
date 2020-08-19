import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Repository } from 'mongodb-typescript';
import { InjectRepo } from 'nestjs-mongodb';
import { Offer } from 'src/offer/offer.entity';

import { OrderDTO, OrderItemDTO } from './order.dto';
import { Order, OrderItem } from './order.entity';

@Injectable()
export class OrderService {

  constructor(
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
}