import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Repository } from 'mongodb-typescript';
import { InjectRepo } from 'nestjs-mongodb';
import { moneyAggregate, moneyMultiply } from 'src/money-util';
import { ObjectIdPipe } from 'src/object-id.pipe';

import { OrderDTO } from './order.dto';
import { Order, OrderItem, OrderStatus } from './order.entity';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {

  constructor(
    @InjectRepo(Order) private orderRepo: Repository<Order>,
    private orderService: OrderService,
  ) { }

  @Post()
  public async placeOrder(@Body() body: OrderDTO): Promise<OrderDTO[]> {
    const order = new Order();

    const items = await Promise.all<OrderItem | null>(
      body.items.map(i => this.orderService.createItem(i))
    );
    order.items = items.filter(i => i !== null && i.offer !== undefined) as OrderItem[];

    order.status = OrderStatus.COMMIT;

    order.price = moneyAggregate(order.items.map(i => moneyMultiply(i.amount)(i.offer.price ?? null)))

    await this.orderRepo.save(order);

    return [this.orderService.toDto(order)];
  }

  @Get(':id')
  public async getOffer(@Param('id', new ObjectIdPipe('ORDER')) id: ObjectId) {
    const order = await this.orderRepo.findById(id);

    return order;
  }
}