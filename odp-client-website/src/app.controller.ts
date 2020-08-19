import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {

  @Get()
  @Render('index')
  root(@Req() req: Request) {
    return {
      sourceUrl: req.cookies?.source ?? 'http://localhost:3000'
    };
  }

  @Post('select-source')
  selectServer(@Body('url') url: string, @Res() res: Response) {
    res.cookie('source', url);
    res.redirect('/list/$');
  }
}
