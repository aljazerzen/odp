import { ObjectId } from 'mongodb';
import { id, ref } from 'mongodb-typescript';
import { Category } from 'src/category/category.entity';
import { Money } from 'src/common/money';

export class Offer {
    @id id: ObjectId;

    @ref() category: Category;

    title?: string;

    field?: { [propertyName: string]: any };

    price?: Money;

    reputation: number;

    images: string[];

    description: string;
}

