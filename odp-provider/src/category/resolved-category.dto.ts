import { FieldFormat } from './category.entity';

export interface ResolvedCategory {
  path: string;

  fields: {
    [fieldName: string]: FieldFormat
  };
}

export interface CategoryDTO extends ResolvedCategory {
  childrenNames: string[];
}