
export interface Category {
  path: string;

  fields: {
    [fieldName: string]: FieldFormat
  };

  childrenNames: string[];
}

export interface FieldFormat {
  type: FieldType;

  categorical?: {
    members?: string[]
  },

  numeric?: {
    min?: number;
    max?: number;
    unit?: string;
  }
}

export enum FieldType {
  NUMERIC = 'NUMERIC', MONEY = 'MONEY', CATEGORICAL = 'CATEGORICAL', TEXT = 'TEXT',
}