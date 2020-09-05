import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { extractOdpUrl } from './url-util';

@Controller()
export class AppController {

  @Get()
  @Render('index')
  root(@Req() req: Request, @Res() res: Response) {

    let error: string | null = null;
    if (req.cookies.errorMsg) {
      error = req.cookies.errorMsg;
      res.clearCookie('errorMsg');
    }

    return {
      sourceUrl: extractOdpUrl(req),
      error
    };
  }

  @Post('select-source')
  selectServer(@Body('url') url: string, @Res() res: Response) {
    res.cookie('source', url);
    res.redirect('/list/$');
  }
}
