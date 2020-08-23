import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { id, objectId } from 'mongodb-typescript';

export class CategoryEntity {
    @id id: ObjectId;
    @objectId parentId?: ObjectId;

    name: string;

    fields: {
        [fieldName: string]: FieldFormat
    };
}

export enum FieldType {
    NUMERIC = 'NUMERIC', MONEY = 'MONEY', CATEGORICAL = 'CATEGORICAL', TEXT = 'TEXT',
}
export class FieldFormat {
    @ApiProperty({ enum: Object.values(FieldType) })
    type: FieldType;

    @ApiProperty()
    categorical: {
        members?: string[]
    };

    @ApiProperty()
    numeric: {
        min?: number;
        max?: number;
        unit?: string;
    };
}
