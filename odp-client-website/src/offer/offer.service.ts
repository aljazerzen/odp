import { Injectable, HttpService } from '@nestjs/common';
import { prependRelativeUrl } from '../url-util';

@Injectable()
export class OfferService {

  constructor(
    private http: HttpService,
  ) { }

  async get(sourceUrl: string, offerId: string) {
    const { data: offer } = await this.http.get(sourceUrl + '/offers/' + offerId).toPromise();

    // prepend image urls
    offer.images = offer.images?.map(prependRelativeUrl(sourceUrl));

    return offer;
  }

}