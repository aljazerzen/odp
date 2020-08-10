import { Injectable } from '@nestjs/common';
import { Condition } from 'mongodb';
import { FieldType } from 'src/category/category.entity';

import { GenericCriteria, RangeCriteria } from './offer-query.dto';

@Injectable()
export class OfferService {

  constructor(
  ) { }

  rangeCriteriaToMongoQuery<T>(field: string, type: FieldType, criteria: RangeCriteria<any>) {
    const and: Condition<T>[] = [];

    if (criteria.min) {
      if (type === FieldType.NUMBER) {
        and.push({ [field]: { $gte: criteria.min } });
      } else if (type === FieldType.MONEY) {
        and.push({ [field + '.amount']: { $gte: criteria.min } });
      }
    }
    if (criteria.max) {
      if (type === FieldType.NUMBER) {
        and.push({ [field]: { $lte: criteria.min } });
      } else if (type === FieldType.MONEY) {
        and.push({ [field + '.amount']: { $gte: criteria.min } });
      }
    }

    return and;
  }

  criteriaToMongoQuery<T>(field: string, type: FieldType, criteria: GenericCriteria<T>): Condition<T>[] {
    const and: Condition<T>[] = [];

    if (criteria.range) {
      and.push(...this.rangeCriteriaToMongoQuery(field, type, criteria.range));
    }

    if (criteria.in) {
      
      and.push({ [field]: { $in: criteria.in.values } });
    }

    return and;
  }

}