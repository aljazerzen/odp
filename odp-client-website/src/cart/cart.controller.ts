import { Body, Controller, Get, HttpService, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { CartService } from './cart.service';
import { prependRelativeUrl } from '../url-util';

@Controller()
export class CartController {

  constructor(
    private http: HttpService,
    private cartService: CartService,
  ) { }

  @Get('cart')
  @Render('cart/cart')
  async cart(@Req() req: Request) {
    const sourceUrl = req.cookies?.source ?? 'http://localhost:3000';

    const cart = this.cartService.parseCart(req.cookies.cart);

    const cartBySource = [];
    for (const item of cart) {
      let source = cartBySource.find(s => s.sourceUrl === item.sourceUrl);

      if (!source) {
        source = {
          sourceUrl: item.sourceUrl,
          cart: []
        };
        cartBySource.push(source);
      }

      source.cart.push(item);
    }

    return {
      sourceUrl,
      cartBySource
    }
  }

  @Post('cart')
  async addToCart(@Req() req: Request, @Res() res: Response, @Body() body) {
    const sourceUrl = req.cookies?.source ?? 'http://localhost:3000';

    const { data: offer } = await this.http.get(sourceUrl + '/offers/' + body.offerId).toPromise();
    offer.images = offer.images?.map(prependRelativeUrl(sourceUrl));

    const oldCart = this.cartService.parseCart(req.cookies.cart);

    const cart = oldCart
      .filter(i => i.offer.id !== offer.id)
      .concat([{
        amount: +(body.amount ?? 1),
        offer,
        sourceUrl: sourceUrl
      }])
      .filter(i => i.amount > 0);

    res.cookie('cart', JSON.stringify(cart));
    res.redirect('/cart');
  }

  @Post('cart/amount')
  async setCartItemAmount(@Req() req: Request, @Res() res: Response, @Body() body) {
    const oldCart = this.cartService.parseCart(req.cookies.cart);

    const cart = oldCart
      .map(i => i.offer.id !== body.offerId ? i : { ...i, amount: +body.amount })
      .filter(i => i.amount > 0);

    res.cookie('cart', JSON.stringify(cart));
    res.redirect('/cart');
  }
}


