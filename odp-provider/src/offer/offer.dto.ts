import { Money } from 'src/common/money';

export class OfferDTO {
    id: string;

    categoryPath: string;

    title?: string;

    field?: { [propertyName: string]: any };

    price?: Money;

    reputation: number;

    images: string[];

    description: string;
}

