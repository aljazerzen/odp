import { ObjectId } from 'mongodb';
import { id, ref } from 'mongodb-typescript';
import { CategoryEntity } from 'src/category/category.entity';
import { Money } from 'src/common/money';

export class OfferEntity {
    @id id: ObjectId;

    @ref() category: CategoryEntity;

    title?: string;

    field?: { [propertyName: string]: any };

    price?: Money;

    reputation: number;

    images: string[];

    description: string;
}

