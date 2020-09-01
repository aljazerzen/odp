export interface ResolvedCategory {
  path: string;

  fields: {
    [fieldName: string]: FieldFormat
  };
}

export interface Category extends ResolvedCategory {
  childrenNames: string[] | null;
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

  _internal: {
    memberIds?: string[];
    id: string;
    isQueryParam: boolean;
  }
}

export enum FieldType {
  NUMERIC = 'NUMERIC', MONEY = 'MONEY', CATEGORICAL = 'CATEGORICAL', TEXT = 'TEXT',
}