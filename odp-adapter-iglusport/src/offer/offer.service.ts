import { HttpService, Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { CategoryService } from 'src/category/category.service';

import { Offer } from './offer.dto';

@Injectable()
export class OfferService {

  categoryCache: { [offerId: string]: string } = {};

  constructor(
    private http: HttpService,
    private categoryService: CategoryService,
  ) {
  }

  async fetchOffers(categoryPath: string, urlSuffix: string): Promise<Offer[]> {
    if (categoryPath.split('.').length < 2) return [];

    const categoryUrl = categoryPath.replace(/[.]/g, '/')
    const url = `https://www.iglusport.si/${categoryUrl}${urlSuffix}`;

    const res = await this.http.get(url).toPromise();

    const $ = cheerio.load(res.data);

    const offers: Offer[] = [];

    $('.item.product.product-item').each((_index, productElement) => {

      const imageUrl = $(productElement).find('.product-image-photo').attr('data-original');

      // const vrsta = $(productElement).find('.ow-vrsta').text();

      const brandName = $(productElement).find('.ow-brand-name').text();
      const itemLinkElement = $(productElement).find('.product-item-link');
      const itemLinkText = itemLinkElement.text();
      const title = itemLinkText.trim();
      const id = itemLinkElement.attr('href').replace('https://www.iglusport.si/', '');

      const priceAmount = $(productElement).find('.price-wrapper').attr('data-price-amount');

      offers.push({
        id,
        title,
        images: [imageUrl],

        price: {
          amount: priceAmount,
          currency: 'EUR'
        },

        categoryPath,
        reputation: 1,

        fields: {
          'Blagovna znamka': brandName
        } as { [name: string]: any }
      } as Offer);
    });

    for (const offer of offers) {
      this.categoryCache[offer.id] = offer.categoryPath;
    }

    return offers;
  }

  getImages($) {
    const gallery = $('.gallery-inner').get();
    if (gallery.length !== 0) {
      return $('.gallery-inner').find('img').toArray().map(e => $(e).attr('src'));
    }

    return [$('meta[property="og:image"]').attr('content')];
  }

  getPrice($) {
    let priceWrapper = $('.product-info-price .special-price .price-wrapper');
    if (priceWrapper.length === 0) {
      priceWrapper = $('.product-info-price .price-wrapper');
    }

    return +priceWrapper.attr('data-price-amount');
  }

  async fetchOffer(id: string): Promise<Offer> {

    const url = `https://www.iglusport.si/${id}`;
    const res = await this.http.get(url).toPromise();

    const $ = cheerio.load(res.data);

    const title = $('.product-info-main .page-title .base').text();
    const description = $('.product.attribute.description').children().first().text();
    const price = this.getPrice($);
    const images = this.getImages($).map(i => i.replace(/\/cache\/[a-z0-9]+/, ''));

    const categoryPath = this.categoryCache[id];
    const category = categoryPath ? await this.categoryService.resolveCategory(categoryPath) : null;
    const fields = ($('table.additional-attributes tr')
      .toArray() as any[])
      .map(e => {
        return [$(e).find('th.label').text(), $(e).find('td.data').text()]
      })
      .filter(([name]) => !!category?.fields[name])
      .reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {});

    return {
      id,
      title,
      description,
      images,
      categoryPath,
      reputation: 1,
      price: {
        amount: +price,
        currency: 'EUR'
      },
      fields
    };
  }
}