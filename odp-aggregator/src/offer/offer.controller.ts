import { BadRequestException, Body, Controller, Get, Param } from '@nestjs/common';
import { Page } from 'src/common/page';

import { OfferQuery } from './offer-query.dto';
import { Offer } from './offer.dto';
import { OfferService } from './offer.service';

@Controller('offers')
export class OfferController {

  constructor(
    private offerService: OfferService,
  ) { }

  @Get()
  public async queryOffers(@Body() query: OfferQuery): Promise<Page<Offer>> {
    return this.offerService.fetchOffers(query);
  }

  @Get(':offerId')
  public async getOffer(@Param('offerId') id: string): Promise<Offer> {
    const offer = await this.offerService.fetchOffer(id);

    if (!offer) throw new BadRequestException('OFFER_NOT_FOUND');
    return offer;
  }
}