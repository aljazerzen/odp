import { Injectable } from '@nestjs/common';
import { Condition } from 'mongodb';
import { FieldFormat, FieldType } from 'src/category/category.entity';
import { ResolvedCategory } from 'src/category/resolved-category.dto';

import { CategoricalCriteria, GenericCriteria, MoneyCriteria, NumericCriteria, TextCriteria } from './offer-query.dto';
import { OfferDTO } from './offer.dto';
import { Offer } from './offer.entity';

@Injectable()
export class OfferService {

  numericCriteriaToMongoQuery<T>(field: string, criteria: NumericCriteria) {
    const and: Condition<T>[] = [];

    if (criteria?.min) {
      and.push({ [field]: { $gte: criteria.min } });
    }
    if (criteria?.max) {
      and.push({ [field]: { $lte: criteria.max } });
    }

    return and;
  }

  textCriteriaToMongoQuery<T>(field: string, criteria: TextCriteria) {
    const and: Condition<T>[] = [];

    if (criteria?.includes) {
      and.push({ [field]: { $text: { $search: criteria.includes } } });
    }

    return and;
  }

  categoricalCriteriaToMongoQuery<T>(field: string, criteria: CategoricalCriteria) {
    const and: Condition<T>[] = [];

    if (criteria?.in) {
      and.push({ [field]: { $in: criteria.in } });
    }

    return and;
  }

  moneyCriteriaToMongoQuery<T>(field: string, criteria: MoneyCriteria): Condition<T>[] {
    if (!criteria) return [];

    const or: Condition<T>[] = [];

    for (const { currency, range } of criteria?.currencies ?? []) {
      or.push({
        $and: [
          { [field + '.currency']: currency },
          ...this.numericCriteriaToMongoQuery(field + '.amount', range)
        ]
      } as Condition<T>);
    }

    if (criteria.includeOthers) {
      or.push({
        [field + '.currency']: { $nin: criteria.currencies?.map(c => c.currency) ?? [] }
      });
    }

    return [{ $or: or } as Condition<T>];
  }

  criteriaToMongoQuery<T>(field: string, format: FieldFormat, criteria: GenericCriteria): Condition<T>[] {
    switch (format.type) {
      case FieldType.NUMERIC:
        return this.numericCriteriaToMongoQuery(field, criteria.numeric);
      case FieldType.TEXT:
        return this.textCriteriaToMongoQuery(field, criteria.text);
      case FieldType.CATEGORICAL:
        return this.categoricalCriteriaToMongoQuery(field, criteria.categorical);
      case FieldType.MONEY:
        return this.moneyCriteriaToMongoQuery(field, criteria.money) as Condition<T>[];
    }
  }

  entityToDto(entity: Offer, categories: { [id: string]: ResolvedCategory }): OfferDTO {
    return {
      ...entity,
      categoryId: undefined,
      categoryPath: categories[(entity as any).categoryId.toHexString()]?.path
    } as any as OfferDTO
  }
}