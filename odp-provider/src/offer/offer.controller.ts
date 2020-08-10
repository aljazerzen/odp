import { Body, Controller, Get } from '@nestjs/common';
import { Condition } from 'mongodb';
import { Repository } from 'mongodb-typescript';
import { InjectRepo } from 'nestjs-mongodb';
import { FieldType } from 'src/category/category.entity';
import { CategoryService } from 'src/category/category.service';
import { Page } from 'src/common/page';

import { OfferQuery } from './offer-query.dto';
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
  public async queryOffers(@Body() query: OfferQuery): Promise<Page<Offer>> {

    const { category, resolved: resolvedCategory } = await this.categoryService.resolveCategory(query.categoryPath ?? '');

    const categoryDescendants = await this.categoryService.getDescendants(category);

    const conditions: Condition<Offer>[] = [
      { categoryId: { $in: categoryDescendants.map(c => c.id) } } as Condition<any>
    ];

    if (query.price) {
      conditions.push(...this.offerService.rangeCriteriaToMongoQuery('price', FieldType.MONEY, query.price));
    }

    if (query.fields) {
      for (const field in query.fields) {
        const fieldType = resolvedCategory.fields[field];
        console.log(resolvedCategory.fields, field, fieldType);
        if (fieldType) {
          conditions.push(...this.offerService.criteriaToMongoQuery('fields.' + field, fieldType, query.fields[field]))
        }
      }
    }

    const cursor = this.offerRepo.find({ $and: conditions });

    const content = cursor.clone().skip(0 * 10).limit(10).toArray();
    const total = cursor.count();
    return { content: await content, total: await total };
  }

}