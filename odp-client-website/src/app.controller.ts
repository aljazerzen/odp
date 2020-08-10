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

  @Get('/list')
  @Render('list')
  async listPage(@Req() req: Request) {
    const categoryPath = req.query.category ?? '$';
    const sourceUrl = req.cookies?.source ?? 'http://localhost:3000';

    const { data: category } = await this.http.get(sourceUrl + '/category/' + categoryPath).toPromise();

    console.log(category);

    return {
      sourceUrl,
      category
    };
  }

  @Post('select-source')
  selectServer(@Body('url') url: string, @Res() res: Response) {
    res.cookie('source', url);
    res.redirect('/list');
  }

}
