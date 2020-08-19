import { Controller, Get, HttpService, Render, Req } from '@nestjs/common';
import { Request } from 'express';

import { prependRelativeUrl } from '../url-util';
import { OfferService } from './offer.service';

@Controller()
export class OfferController {

  constructor(
    private http: HttpService,
    private offerService: OfferService
  ) { }

  @Get('/list/:category')
  @Render('offer/list')
  async listPage(@Req() req: Request) {
    const categoryPath = req.params.category ?? '$';
    const sourceUrl = req.cookies?.source ?? 'http://localhost:3000';

    const { data: category } = await this.http.get(sourceUrl + '/categories/' + categoryPath).toPromise();

    const fields = {};
    for (const name in req.query) {
      if (req.query.hasOwnProperty(name) && req.query[name] !== '') {
        if (name.startsWith('f.')) {

          const field = name.split('.')[1];
          const format = category.fields[field];

          fields[field] = fields[field] || {};

          switch (format.type) {
            case 'NUMERIC':
              fields[field].numeric = fields[field].numeric || {};
              if (name.endsWith('.min')) {
                fields[field].numeric.min = +req.query[name];
              }
              if (name.endsWith('.max')) {
                fields[field].numeric.max = +req.query[name];
              }
              break;
            case 'CATEGORICAL':
              fields[field].categorical = fields[field].categorical || {};
              fields[field].categorical.in = Array.isArray(req.query[name]) ? req.query[name] : [req.query[name]];
              break;
          }
        }
      }
    }


    const offerQuery = {
      categoryPath: category.path,
      fields
    };
    const { data: offerPage } = await this.http.get(sourceUrl + '/offers', { data: offerQuery }).toPromise();

    // prepend image urls
    for (const offer of offerPage.content) {
      offer.images = offer.images?.map(prependRelativeUrl(sourceUrl));
    }

    return {
      sourceUrl,
      category,
      offerPage,
      offerQuery,
      lastQuery: req.query
    };
  }

  @Get('/offer/:offerId')
  @Render('offer/offer')
  async offerPage(@Req() req: Request) {
    const sourceUrl = req.cookies?.source ?? 'http://localhost:3000';

    return {
      sourceUrl,
      offer: await this.offerService.get(sourceUrl, req.params.offerId)
    };
  }
}
