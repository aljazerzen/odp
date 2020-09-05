import { Controller, Get, HttpService, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { extractOdpUrl, prependRelativeUrl, urlOdpToHttp } from '../url-util';
import { OfferService } from './offer.service';

@Controller()
export class OfferController {

  constructor(
    private http: HttpService,
    private offerService: OfferService
  ) { }

  @Get('/list/:category')
  async listPage(@Req() req: Request, @Res() res: Response) {
    const categoryPath = req.params.category ?? '$';
    const sourceUrl = urlOdpToHttp(extractOdpUrl(req));

    const { data: category, status } = await this.http.get(sourceUrl + '/categories/' + categoryPath).toPromise()
      .catch((e) => ({ data: null, status: e.response?.status ?? e.code }));
    if (!category) {
      res.cookie('errorMsg', `Napaka ${status} pri povezovanju do '${sourceUrl}'`);
      res.redirect('/');
      return;
    }

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

    res.render(
      'offer/list',
      {
        sourceUrl: extractOdpUrl(req),
        category,
        offerPage,
        offerQuery,
        lastQuery: req.query
      }
    );
  }

  @Get('/offer/:offerId')
  @Render('offer/offer')
  async offerPage(@Req() req: Request) {
    return {
      sourceUrl: extractOdpUrl(req),
      offer: await this.offerService.get(urlOdpToHttp(extractOdpUrl(req)), req.params.offerId)
    };
  }
}
