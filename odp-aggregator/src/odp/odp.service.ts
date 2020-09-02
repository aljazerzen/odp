import { HttpService, Injectable } from '@nestjs/common';
import * as URL from 'url';

import { Category } from '../category/category.dto';
import { Page } from '../common/page';
import { OfferQuery } from '../offer/offer-query.dto';
import { Offer } from '../offer/offer.dto';

function flattenRoundRobin<T>(array: T[][]) {
  const r: T[] = [];

  let someFound = true;
  for (let i = 0; someFound; i++) {
    someFound = false;

    for (const subArray of array) {
      if (i < subArray.length) {
        r.push(subArray[i]);
        someFound = true;
      }
    }
  }

  return r;
}

@Injectable()
export class OdpClientService {

  readonly sourceUrls: string[] = (process.env.SOURCE_URLS || '').split(',').map(str => {
    const url = URL.parse(str);
    switch (url.protocol) {
      case 'odps:':
        url.protocol = 'https';
        break;
      case 'odp:':
        url.protocol = 'http';
        break;
      default:
        console.warn(`unsupported protocol: "${url.protocol}" from source url "${str}". Skipping.`);
        return null;
    };

    url.path = null;
    url.query = null;
    return URL.format(url);
  }).filter(u => !!u) as string[];

  constructor(
    private http: HttpService
  ) {
    console.log(`aggregating ${this.sourceUrls.join(', ')}`)
  }

  async fetchCategories(categoryPath: string): Promise<Category[]> {
    const categories = await this.getAll<Category>('/categories/' + categoryPath);

    return categories.filter(r => !!r.data).map(r => r.data as Category);
  }

  async fetchOffers(query: OfferQuery): Promise<Page<CallResult<Offer>>> {

    const res = await this.getAll<Page<Offer>>('/offers', query);

    const total = res.reduce((a, r) => a + (r.data?.total ?? 0), 0);
    const content = res
      .filter(r => !!r.data)
      .map(r => (r.data as Page<Offer>).content.map(o => ({
        sourceUrl: r.sourceUrl,
        data: o
      })));

    return {
      total,
      content: flattenRoundRobin(content)
    }
  }

  fetchOffer(odpSource: string, offerId: string): Promise<Offer | null> {
    return this.getOne<Offer>(odpSource, '/offers/' + offerId);
  }

  private getAll<T>(odpPath: string, body?: any): Promise<CallResult<T>[]> {
    const promises = this.sourceUrls.map(async sourceUrl => {
      const data = await this.getOne<T>(sourceUrl, odpPath, body);

      return { data, sourceUrl };
    });

    return Promise.all(promises);
  }

  private async getOne<T>(odpSource: string, odpPath: string, body?: any): Promise<T | null> {
    const url = odpSource + odpPath;
    try {
      const { data } = await this.http.get<T>(url, { data: body }).toPromise();

      return data;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(`fetching from "${url}":`, e.response.status, e.response?.data);
      return null;
    }
  }
}

interface CallResult<T> {
  data: T | null;
  sourceUrl: string;
}