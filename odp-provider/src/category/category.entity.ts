import { ObjectId } from 'mongodb';
import { id, objectId } from 'mongodb-typescript';

export class Category {
    @id id: ObjectId;
    @objectId parentId?: ObjectId;

    name: string;

    fields: {
        [fieldName: string]: FieldType
    };
}

export enum FieldType {
    STRING = 'STRING', NUMBER = 'NUMBER', MONEY = 'MONEY', BOOLEAN = 'BOOLEAN'
}