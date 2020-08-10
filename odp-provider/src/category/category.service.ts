import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'mongodb-typescript';
import { InjectRepo } from 'nestjs-mongodb';

import { Category } from './category.entity';
import { ResolvedCategory } from './resolved-category.dto';


@Injectable()
export class CategoryService {

  constructor(
    @InjectRepo(Category) private categoryRepo: Repository<Category>
  ) { }

  public async resolveCategory(path: string): Promise<{ resolved: ResolvedCategory, category: Category }> {
    if (path.startsWith('$')) {
      path = path.substring(1);
    }
    if (path.startsWith('.')) {
      path = path.substring(1);
    }

    const resolved: ResolvedCategory = {
      path: path || '$',
      fields: {}
    };

    const names = path.split('.').filter(a => a.length > 0);

    let parent: Category = null;
    for (const name of names) {
      const category = await this.categoryRepo.findOne({
        name,
        parentId: parent?.id ?? { $exists: false }
      });

      if (!category) throw new NotFoundException({ code: 'CATEGORY_NOT_FOUND' });

      resolved.fields = { ...resolved.fields, ...category.fields };

      parent = category;
    }

    return { resolved, category: parent };
  }

  public async getDescendants(category: Category): Promise<Category[]> {
    let toQuery = [category];
    const result = [];

    while (toQuery.length > 0) {
      result.push(...toQuery);

      toQuery = await this.getChildren(toQuery);
    }
    return result;
  }

  public async getChildren(categories: (Category | null)[]): Promise<Category[]> {
    return await this.categoryRepo.find({
      parentId: { $in: categories.map(c => c?.id) }
    }).toArray();
  }

}