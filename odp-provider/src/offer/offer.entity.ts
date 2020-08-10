import { ObjectId } from 'mongodb';
import { id, ref } from 'mongodb-typescript';
import { Category } from 'src/category/category.entity';

import { Price } from '../common/price';

export class Offer {
    @id id: ObjectId;

    @ref() category: Category;

    field?: Fields;

    price?: Price;

    reputation: number;
}

export class Fields {
    [propertyName: string]: any;
}
