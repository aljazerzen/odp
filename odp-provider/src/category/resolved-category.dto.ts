import { FieldType } from './category.entity';

export interface ResolvedCategory {
  path: string;

  fields: {
    [fieldName: string]: FieldType
  };
}

export interface CategoryDTO extends ResolvedCategory {
  path: string;

  fields: {
    [fieldName: string]: FieldType
  };

  childrenNames: string[];
}