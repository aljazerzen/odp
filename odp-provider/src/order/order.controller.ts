import { Body, Controller, ForbiddenException, Get, Param, Post } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Repository } from 'mongodb-typescript';
import { InjectRepo } from 'nestjs-mongodb';
import { ObjectIdPipe } from 'src/object-id.pipe';

import { OrderDTO } from './order.dto';
import { Order, OrderItem, OrderStatus, PaymentRequest } from './order.entity';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {

  constructor(
    @InjectRepo(Order) private orderRepo: Repository<Order>,
    private orderService: OrderService,
  ) { }

  @Get(':id')
  public async getOffer(@Param('id', new ObjectIdPipe('ORDER')) id: ObjectId) {
    const order = await this.orderRepo.findById(id);

    return order;
  }

  @Post()
  public async placeOrder(@Body() body: OrderDTO): Promise<OrderDTO[]> {
    const order = new Order();

    order.status = OrderStatus.QUOTE;

    const items = await Promise.all<OrderItem | null>(
      body.items.map(i => this.orderService.createItem(i))
    );
    order.items = items.filter(i => i !== null && i.offer !== undefined) as OrderItem[];

    await this.orderRepo.save(order);

    // schedule quote in 3 sec
    setTimeout(() => this.orderService.quote(order.id), 1000 * 3);

    return [this.orderService.toDto(order)];
  }

  @Post(':id/commitment')
  public async commitOrder(@Param('id', new ObjectIdPipe('ORDER')) id: ObjectId) {
    const order = await this.orderRepo.findById(id);

    if (order?.status !== OrderStatus.COMMIT) return new ForbiddenException('STATE_MISMATCH');

    order.status = OrderStatus.PRE_REQUEST;

    await this.orderRepo.save(order);

    // schedule pre payment request in 3 sec
    setTimeout(() => this.orderService.requestPre(order.id), 1000 * 3);

    return [this.orderService.toDto(order)];
  }

  @Post(':id/pre-selection')
  public async selectPrePaymentMethod(@Param('id', new ObjectIdPipe('ORDER')) id: ObjectId, @Body() body: PaymentRequest) {
    const order = await this.orderRepo.findById(id);

    if (order?.status !== OrderStatus.PRE_SELECT) return new ForbiddenException('STATE_MISMATCH');

    if (!(order.prePayment && body.selectedMethod && order.prePayment.availableMethods?.includes(body.selectedMethod))) {
      return [this.orderService.toDto(order)];
    }


    order.status = OrderStatus.PRE_PROVIDE;
    order.prePayment.selectedMethod = body.selectedMethod;

    await this.orderRepo.save(order);

    // schedule accepted payment in 3 sec
    setTimeout(() => this.orderService.acceptPrePayment(order.id), 1000 * 3);

    return [this.orderService.toDto(order)];
  }

  @Post(':id/confirmation')
  public async confirmOrder(@Param('id', new ObjectIdPipe('ORDER')) id: ObjectId) {
    const order = await this.orderRepo.findById(id);

    if (order?.status !== OrderStatus.CONFIRM) return new ForbiddenException('STATE_MISMATCH');

    order.status = OrderStatus.POST_REQUEST;

    await this.orderRepo.save(order);

    // schedule post payment request in 3 sec
    setTimeout(() => this.orderService.requestPost(order.id), 1000 * 3);

    return [this.orderService.toDto(order)];
  }

  @Post(':id/post-selection')
  public async selectPostPaymentMethod(@Param('id', new ObjectIdPipe('ORDER')) id: ObjectId, @Body() body: PaymentRequest) {
    const order = await this.orderRepo.findById(id);

    if (order?.status !== OrderStatus.POST_SELECT) return new ForbiddenException('STATE_MISMATCH');

    if (!(order.postPayment && body.selectedMethod && order.postPayment.availableMethods?.includes(body.selectedMethod))) {
      return [this.orderService.toDto(order)];
    }

    order.status = OrderStatus.POST_PROVIDE;
    order.postPayment.selectedMethod = body.selectedMethod;

    await this.orderRepo.save(order);

    // schedule accepted payment in 3 sec
    setTimeout(() => this.orderService.acceptPostPayment(order.id), 1000 * 3);

    return [this.orderService.toDto(order)];
  }
}