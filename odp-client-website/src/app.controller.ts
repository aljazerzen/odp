import { Body, Controller, Get, HttpService, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as url from 'url';

function prependRelativeUrl(prefix) {
  return relativeUrl => {
    const u = url.parse(relativeUrl);
    return (!u.hostname && !u.port ? prefix : '') + relativeUrl;
  };
}

@Controller()
export class AppController {

  constructor(private http: HttpService) { }

  @Get()
  @Render('index')
  root(@Req() req: Request) {
    return {
      message: 'Hello world!',
      sourceUrl: req.cookies?.source ?? 'http://localhost:3000'
    };
  }

  @Get('/list/:category')
  @Render('list')
  async listPage(@Req() req: Request) {
    const categoryPath = req.params.category ?? '$';
    const sourceUrl = req.cookies?.source ?? 'http://localhost:3000';

    const { data: category } = await this.http.get(sourceUrl + '/category/' + categoryPath).toPromise();

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
    const { data: offerPage } = await this.http.get(sourceUrl + '/offer', { data: offerQuery }).toPromise();

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
  @Render('offer')
  async offerPage(@Req() req: Request) {
    const sourceUrl = req.cookies?.source ?? 'http://localhost:3000';

    const { data: offer } = await this.http.get(sourceUrl + '/offer/' + req.params.offerId).toPromise();

    // prepend image urls
    offer.images = offer.images?.map(prependRelativeUrl(sourceUrl));

    return {
      sourceUrl,
      offer
    };
  }

  @Post('select-source')
  selectServer(@Body('url') url: string, @Res() res: Response) {
    res.cookie('source', url);
    res.redirect('/list/$');
  }

}
