import { Injectable } from '@nestjs/common';
import { OdpClientService } from 'src/odp/odp.service';

import { Category } from './category.dto';

/**
 * Usage: array.filter(onlyUnique)
 */
export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
@Injectable()
export class CategoryService {

  categories: ResolvedCategoryMap;

  constructor(
    private odpClientService: OdpClientService
  ) {
  }

  async resolveCategory(path: string): Promise<Category | null> {
    if (path.startsWith('$')) path = path.substring(1);
    if (path.startsWith('.')) path = path.substring(1);
    if (path === '') path = '$';

    const categories = await this.odpClientService.fetchCategories(path);
    if (!categories.length) return null;

    const aggregated = categories.reduce((agg, cat) => {
      agg.childrenNames = agg.childrenNames?.concat(cat.childrenNames)?.filter(onlyUnique) ?? [];
      agg.fields = {
        ...agg.fields,
        ...cat.fields
      };
      return agg;
    }, { path, childrenNames: [], fields: {} } as Category);

    return aggregated;
  }
}

export interface ResolvedCategoryMap { [id: string]: Category | null }