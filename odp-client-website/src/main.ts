import './helpers';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';
import { join } from 'path';

import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'), (_error) => null);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.use(cookieParser())

  await app.listen(3100);
}
bootstrap();