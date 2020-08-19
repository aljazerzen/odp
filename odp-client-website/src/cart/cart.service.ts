import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {

  parseCart(cookie: string | undefined) {
    try {
      return JSON.parse(cookie) ?? [] as [];
    } catch(e) {
      return [];
    }
  }

}