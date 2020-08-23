import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class NumericCriteria {
    @ApiProperty({ required: false })
    min?: number;
    @ApiProperty({ required: false })
    max?: number;
}

export class CurrencyCriteria {
    @ApiProperty()
    currency: string;
    @ApiProperty()
    range: NumericCriteria;
}
export class MoneyCriteria {
    @ApiProperty({ required: false, type: CurrencyCriteria, isArray: true })
    currencies: CurrencyCriteria[];

    @ApiProperty({ required: false })
    includeOthers: boolean;
}

export class TextCriteria {
    @ApiProperty({ required: false })
    includes: string;
}

export class CategoricalCriteria {
    @ApiProperty({ required: false, type: 'string', isArray: true })
    in: string[];
}
export class GenericCriteria {
    @ApiProperty({ required: false })
    numeric: NumericCriteria;
    @ApiProperty({ required: false })
    categorical: CategoricalCriteria;
    @ApiProperty({ required: false })
    text: TextCriteria;
    @ApiProperty({ required: false })
    money: MoneyCriteria;
};

export class Payment {
    @ApiProperty({ required: false })
    pre?: MoneyCriteria;
    @ApiProperty({ required: false })
    post?: MoneyCriteria;
    @ApiProperty({ required: false })
    total?: MoneyCriteria;
}

@ApiExtraModels(GenericCriteria)
export class OfferQuery {
    @ApiProperty()
    categoryPath: string;

    @ApiProperty()
    title?: TextCriteria;

    @ApiProperty({ additionalProperties: { $ref: getSchemaPath(GenericCriteria) } })
    fields?: { [fieldName: string]: GenericCriteria };

    @ApiProperty()
    price?: MoneyCriteria;

    @ApiProperty()
    reputation?: NumericCriteria;
}
