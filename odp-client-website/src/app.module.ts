import { HttpModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
