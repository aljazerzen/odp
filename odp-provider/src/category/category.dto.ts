import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { FieldFormat } from './category.entity';

@ApiExtraModels(FieldFormat)
export class ResolvedCategory {
  @ApiProperty({ example: 'parent1Category.parent2Category.thisCategory' })
  path: string;

  @ApiProperty({ additionalProperties: { $ref: getSchemaPath(FieldFormat) } })
  fields: {
    [fieldName: string]: FieldFormat
  };
}

export class Category extends ResolvedCategory {
  @ApiProperty()
  childrenNames: string[];
}