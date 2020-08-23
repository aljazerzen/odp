import { Body, Controller, Get, HttpService, Param, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { CartService } from '../cart/cart.service';
import { OfferService } from '../offer/offer.service';
import { UriComponentPipe } from '../uri-component.pipe';

@Controller()
export class OrderController {

  constructor(
    private http: HttpService,
    private cartService: CartService,
    private offerService: OfferService,
  ) { }

  @Get('/orders')
  @Render('order/orders')
  async ordersPage(@Req() req: Request) {
    const sourceUrl = req.cookies?.source ?? 'http://localhost:3000';

    const orderUrls = this.cartService.parseCart(req.cookies.orders);

    const orders = await Promise.all(
      orderUrls.map(async orderUrl => {
        const { data: order } = await this.http.get(orderUrl).toPromise().catch(e => {
          console.warn(e.toString());
          return { data: {} };
        });
        return { ...order, url: orderUrl };
      })
    );

    return {
      sourceUrl,
      orders
    };
  }

  @Post('/order')
  async placeOrder(@Req() req: Request, @Res() res: Response, @Body() body: PlaceOrderDTO) {
    const sourceUrl = body.sourceUrl;
    const cart = this.cartService.parseCart(req.cookies.cart);

    const data = {
      items: cart
        .filter(i => i.sourceUrl === sourceUrl)
        .map(i => ({
          amount: i.amount,
          offerId: i.offer.id
        }))
    };

    if (data.items.length === 0) {
      res.redirect('back');
      return;
    }

    const { data: orders } = await this.http.post(sourceUrl + '/orders', data).toPromise();

    let lastOrderUrl;

    const orderUrls = this.cartService.parseCart(req.cookies.orders);
    for (const order of orders) {
      const orderUrl = sourceUrl + '/orders/' + order.id;

      orderUrls.push(orderUrl);

      lastOrderUrl = orderUrl;
    }
    res.cookie('orders', JSON.stringify(orderUrls), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });

    // remove items from cart
    const newCart = cart.filter(i => i.sourceUrl !== sourceUrl);
    res.cookie('cart', JSON.stringify(newCart));

    if (lastOrderUrl) {
      res.redirect('/order/' + encodeURIComponent(lastOrderUrl))
    } else {
      res.redirect('/orders');
    }
  }

  @Get('/order/:orderUrl')
  @Render('order/order')
  async orderPage(
    @Param('orderUrl', new UriComponentPipe()) orderUrl: string
  ) {
    const { data: order, status } = await this.http.get(orderUrl).toPromise().catch(e => {
      console.warn(e.toString());
      return { data: null, status: 0 };
    });

    if (status !== 200) {
      console.log(status, order);
      return {};
    }

    const sourceUrl = orderUrl.split('/orders/')[0]

    await Promise.all(order.items.map(async i => {
      i.offer = await this.offerService.get(sourceUrl, i.offerId);
    }));

    return {
      sourceUrl,
      orderUrl: sourceUrl + '/orders/' + order.id,
      order
    };
  }

  @Post('/order/:orderUrl/commit')
  async commitOrder(
    @Param('orderUrl', new UriComponentPipe()) orderUrl: string, @Res() res: Response
  ) {
    const { data } = await this.http.post(orderUrl + '/commitment').toPromise();
    console.log(data);

    res.redirect('/order/' + encodeURIComponent(orderUrl))
  }

  @Post('/order/:orderUrl/pre-select')
  async selectPreOrder(
    @Param('orderUrl', new UriComponentPipe()) orderUrl: string, @Body() body: { method: string }, @Res() res: Response
  ) {
    const { data } = await this.http.post(orderUrl + '/pre-selection', { selectedMethod: body.method }).toPromise();
    console.log(data);

    res.redirect('/order/' + encodeURIComponent(orderUrl))
  }

  @Post('/order/:orderUrl/confirm')
  async confirmOrder(
    @Param('orderUrl', new UriComponentPipe()) orderUrl: string, @Res() res: Response
  ) {
    const { data } = await this.http.post(orderUrl + '/confirmation').toPromise();
    console.log(data);

    res.redirect('/order/' + encodeURIComponent(orderUrl))
  }

  @Post('/order/:orderUrl/post-select')
  async selectPostOrder(
    @Param('orderUrl', new UriComponentPipe()) orderUrl: string, @Body() body: { method: string }, @Res() res: Response
  ) {
    const { data } = await this.http.post(orderUrl + '/post-selection', { selectedMethod: body.method }).toPromise();
    console.log(data);

    res.redirect('/order/' + encodeURIComponent(orderUrl))
  }
}

interface PlaceOrderDTO {
  sourceUrl: string;
}
