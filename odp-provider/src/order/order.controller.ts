import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Repository } from 'mongodb-typescript';
import { InjectRepo } from 'src/common/database.module';
import { Error } from 'src/common/error.dto';
import { ObjectIdPipe } from 'src/object-id.pipe';

import { Order } from './order.dto';
import { OrderEntity, OrderItemEntity, OrderStatus, PaymentMethodSelection } from './order.entity';
import { OrderService } from './order.service';

@Controller('orders')
@ApiTags('order')
export class OrderController {

  constructor(
    @InjectRepo(OrderEntity) private orderRepo: Repository<OrderEntity>,
    private orderService: OrderService,
  ) { }

  @Get(':id')
  @ApiParam({ type: 'string', name: 'id' })
  @ApiOkResponse({ type: Order })
  @ApiNotFoundResponse({ type: Error })
  public async getOffer(@Param('id', new ObjectIdPipe('ORDER')) id: ObjectId): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');

    return this.orderService.toDto(order);
  }

  @Post()
  public async placeOrder(@Body() body: Order): Promise<Order[]> {
    const order = new OrderEntity();

    order.status = OrderStatus.QUOTE;

    const items = await Promise.all<OrderItemEntity | null>(
      body.items.map(i => this.orderService.createItem(i))
    );
    order.items = items.filter(i => i !== null && i.offer !== undefined) as OrderItemEntity[];

    await this.orderRepo.save(order);

    // schedule quote in 3 sec
    setTimeout(() => this.orderService.quote(order.id), 1000 * 3);

    return [this.orderService.toDto(order)];
  }

  @Post(':id/commitment')
  @ApiCreatedResponse()
  @ApiForbiddenResponse({ type: Error })
  @ApiParam({ type: 'string', name: 'id' })
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
  @ApiCreatedResponse()
  @ApiForbiddenResponse({ type: Error })
  @ApiParam({ type: 'string', name: 'id' })
  public async selectPrePaymentMethod(@Param('id', new ObjectIdPipe('ORDER')) id: ObjectId, @Body() body: PaymentMethodSelection) {
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
  @ApiCreatedResponse()
  @ApiForbiddenResponse({ type: Error })
  @ApiParam({ type: 'string', name: 'id' })
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
  @ApiCreatedResponse()
  @ApiForbiddenResponse({ type: Error })
  @ApiParam({ type: 'string', name: 'id' })
  public async selectPostPaymentMethod(@Param('id', new ObjectIdPipe('ORDER')) id: ObjectId, @Body() body: PaymentMethodSelection) {
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