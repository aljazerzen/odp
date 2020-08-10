import { Money } from '../common/money';

export class OfferQuery {
    categoryPath: string;

    fields?: { [fieldName: string]: GenericCriteria<any> };

    price?: RangeCriteria<Money>;

    reputation?: RangeCriteria<number>;
}

export class GenericCriteria<T> {
    range?: RangeCriteria<T>;
    in?: InCriteria<T>;
}

export class Payment {
    pre?: RangeCriteria<Money>;
    post?: RangeCriteria<Money>;
    total?: RangeCriteria<Money>;
}

export class RangeCriteria<T> {
    min?: T;
    max?: T;
}

export class InCriteria<T> {
    values: T[];
}
