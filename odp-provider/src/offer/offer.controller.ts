import { Body, Controller, Get, Param } from '@nestjs/common';
import { Condition, ObjectID } from 'mongodb';
import { Repository } from 'mongodb-typescript';
import { InjectRepo } from 'nestjs-mongodb';
import { CategoryService } from 'src/category/category.service';
import { Page } from 'src/common/page';

import { OfferQuery } from './offer-query.dto';
import { OfferDTO } from './offer.dto';
import { Offer } from './offer.entity';
import { OfferService } from './offer.service';

@Controller('offer')
export class OfferController {

  constructor(
    @InjectRepo(Offer) private offerRepo: Repository<Offer>,
    private categoryService: CategoryService,
    private offerService: OfferService
  ) { }

  @Get()
  public async queryOffers(@Body() query: OfferQuery): Promise<Page<OfferDTO>> {

    const { category, resolved: resolvedCategory } = await this.categoryService.resolveCategory(query.categoryPath ?? '');

    const categoryDescendants = await this.categoryService.getDescendants(category);
    const resolvedCategories = this.categoryService.resolveDescendants(category?.id, resolvedCategory, categoryDescendants);

    const conditions: Condition<Offer>[] = [
      { categoryId: { $in: categoryDescendants.filter(c => !!c).map(c => c.id) } } as Condition<any>
    ];

    if (query.price) {
      conditions.push(...this.offerService.moneyCriteriaToMongoQuery('price', query.price));
    }

    if (query.fields) {
      for (const field in query.fields) {
        if (query.fields.hasOwnProperty(field)) {
          const fieldFormat = resolvedCategory.fields[field];

          if (fieldFormat) {
            conditions.push(...this.offerService.criteriaToMongoQuery('fields.' + field, fieldFormat, query.fields[field]))
          }
        }
      }
    }

    const cursor = this.offerRepo.find({ $and: conditions });

    const total = cursor.clone().count();
    const content = cursor.skip(0 * 10).limit(10)
      .map(o => this.offerService.entityToDto(o, resolvedCategories))
      .toArray();
    return { content: await content, total: await total };
  }

  @Get(':offerId')
  public async getOffer(@Param('offerId') idString: string): Promise<OfferDTO> {
    const id = ObjectID.createFromHexString(idString);

    const offer = await this.offerRepo.findById(id);

    const categoryId = (offer as any).categoryId as ObjectID;
    const category = await this.categoryService.resolveCategoryById(categoryId);

    return this.offerService.entityToDto(offer, { [categoryId.toHexString()]: category });
  }
}