import { Injectable } from '@nestjs/common';
import { Page } from 'src/common/page';
import { OdpClientService } from 'src/odp/odp.service';

import { prependRelativeUrl } from '../common/url-util';
import { OfferQuery } from './offer-query.dto';
import { Offer } from './offer.dto';

@Injectable()
export class OfferService {

  sourceCache: { [offerId: string]: string } = {};

  constructor(
    private odpClientService: OdpClientService,
  ) {
  }

  prependRelativeUrls(sourceUrl: string) {
    return (offer: Offer | null) => {
      if (!offer) return offer;
      return {
        ...offer,
        images: offer.images.map(prependRelativeUrl(sourceUrl))
      };
    };
  }

  async fetchOffers(offerQuery: OfferQuery): Promise<Page<Offer>> {
    const page = await this.odpClientService.fetchOffers(offerQuery);

    for (const res of page.content) {
      if (res.data) {
        this.sourceCache[res.data.id] = res.sourceUrl;
      }
    }

    return {
      content: page.content.filter(r => !!r.data).map(r => this.prependRelativeUrls(r.sourceUrl)(r.data) as Offer),
      total: page.total
    };
  }

  async fetchOffer(id: string): Promise<Offer | null> {
    const source = this.sourceCache[id];
    if (!source) return null;

    const offer = await this.odpClientService.fetchOffer(source, id);
    return this.prependRelativeUrls(source)(offer);
  }
}