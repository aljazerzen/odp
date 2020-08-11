import { Body, Controller, Get, HttpService, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

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

    const offerQuery = {
      categoryPath: category.path,
      
    };
    const { data: offerPage } = await this.http.get(sourceUrl + '/offer', { data: offerQuery }).toPromise();

    return {
      sourceUrl,
      category,
      offerPage
    };
  }

  @Post('select-source')
  selectServer(@Body('url') url: string, @Res() res: Response) {
    res.cookie('source', url);
    res.redirect('/list/$');
  }

}
