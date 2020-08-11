import { ObjectId } from 'mongodb';
import { id, objectId } from 'mongodb-typescript';

export class Category {
    @id id: ObjectId;
    @objectId parentId?: ObjectId;

    name: string;

    fields: {
        [fieldName: string]: FieldFormat
    };
}

export interface FieldFormat {
    type: FieldType;

    categorical: {
        members?: string[]
    },

    numeric: {
        min?: number;
        max?: number;
        unit?: string;
    }
}

export enum FieldType {
    NUMERIC = 'NUMERIC', MONEY = 'MONEY', CATEGORICAL = 'CATEGORICAL', TEXT = 'TEXT',
}