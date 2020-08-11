export class OfferQuery {
    categoryPath: string;

    title?: TextCriteria;

    fields?: { [fieldName: string]: GenericCriteria };

    price?: MoneyCriteria;

    reputation?: NumericCriteria;
}

export interface GenericCriteria {
    numeric: NumericCriteria;
    categorical: CategoricalCriteria;
    text: TextCriteria;
    money: MoneyCriteria;
};

export class Payment {
    pre?: MoneyCriteria;
    post?: MoneyCriteria;
    total?: MoneyCriteria;
}

export class NumericCriteria {
    min?: number;
    max?: number;
}

export class MoneyCriteria {
    currencies: {
        currency: string;
        range: NumericCriteria;
    }[];

    includeOthers: boolean;
}

export class TextCriteria {
    includes: string;
}

export class CategoricalCriteria {
    in: string[];
}
