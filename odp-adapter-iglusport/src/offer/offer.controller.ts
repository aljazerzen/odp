import { Body, Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { Page } from 'src/common/page';

import { OfferQuery } from './offer-query.dto';
import { Offer } from './offer.dto';
import { OfferService } from './offer.service';

@Controller('offers')
export class OfferController {

  constructor(
    private categoryService: CategoryService,
    private offerService: OfferService,
  ) { }

  @Get()
  public async queryOffers(@Body() query: OfferQuery): Promise<Page<Offer>> {

    const category = await this.categoryService.resolveCategory(query.categoryPath);

    const pathParams: string[] = [];
    const queryParams: string[] = [];

    for (const fieldName of Object.keys(query.fields || {})) {
      const format = category.fields[fieldName];
      const criteria = (query.fields || {})[fieldName];

      if (format.categorical && format._internal.memberIds && criteria?.categorical?.in) {
        const inMemberIds = criteria.categorical.in
          .map(member => format.categorical?.members?.indexOf(member) ?? -1)
          .filter(index => index >= 0)
          .map(index => (format._internal.memberIds || [])[index]);

        if (format._internal.isQueryParam) {
          queryParams.push(format._internal.id + '=' + encodeURIComponent(inMemberIds.join(',')));
        } else {
          pathParams.push(inMemberIds.join('_'));
        }

      }
    }

    const suffix = (pathParams.length > 0 ? '/' : '') + pathParams.join('_') +
      (queryParams.length > 0 ? '?' : '') + queryParams.join('&');

    return {
      content: await this.offerService.fetchOffers(query.categoryPath, suffix),
      total: 0
    };
  }

  @Get(':offerId')
  public async getOffer(@Param('offerId') id: string): Promise<Offer> {
    return this.offerService.fetchOffer(id);
  }
}