import { HttpModule, Module } from '@nestjs/common';

import { OdpClientService } from './odp.service';

@Module({
  imports: [HttpModule],
  providers: [OdpClientService],
  exports: [OdpClientService]
})
export class OdpModule {}
