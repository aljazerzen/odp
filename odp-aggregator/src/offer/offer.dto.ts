import { Money } from 'src/common/money';

export class Offer {
    id: string;

    categoryPath: string;

    title?: string;

    fields?: { [propertyName: string]: any };

    price?: Money;

    reputation: number;

    images: string[];

    description: string;
}

