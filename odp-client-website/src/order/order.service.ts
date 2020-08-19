import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {

  parseOrderUrls(cookie: string | undefined) {
    try {
      return JSON.parse(cookie) ?? [] as [];
    } catch(e) {
      return [];
    }
  }

}