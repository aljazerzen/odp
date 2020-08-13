import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
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

  public async resolveCategoryById(categoryId: ObjectId): Promise<ResolvedCategory> {
    const resolved: ResolvedCategory = {
      path: '',
      fields: {}
    };

    let parentId: ObjectId = categoryId;
    while (parentId) {
      const category = await this.categoryRepo.findById(parentId);
      resolved.path = category.name + '.' + resolved.path;
      resolved.fields = {
        ...category.fields,
        ...resolved.fields
      };

      parentId = category.parentId;
    }
    // remove last dot
    resolved.path = resolved.path.substring(0, resolved.path.length - 1);
    return resolved;
  }

  public async getDescendants(category: Category | null): Promise<(Category | null)[]> {
    let toQuery = [category];
    const result = [];

    while (toQuery.length > 0) {
      result.push(...toQuery);

      toQuery = await this.getChildren(toQuery);
    }
    return result;
  }

  public resolveDescendants(parentId: ObjectId | null, parent: ResolvedCategory | null, categories: Category[]): { [id: string]: ResolvedCategory } {
    const resolved: { [id: string]: ResolvedCategory } = {
      [parentId?.toHexString()]: parent
    };

    const unresolved = [...categories];

    let someResolved = true;
    while (someResolved) {
      someResolved = false;

      for (let i = 0; i < unresolved.length; i++) {
        const c = unresolved[i];
        if (!c) continue;

        const p = resolved[c.parentId?.toHexString()];
        if (p) {
          unresolved.splice(i, 1);
          i--;

          resolved[c.id.toHexString()] = {
            path: p.path + '.' + c.name,
            fields: { ...p.fields, ...c.fields }
          }
          someResolved = true;
        }
      }
    }

    return resolved;
  }

  public async getChildren(categories: (Category | null)[]): Promise<Category[]> {
    return await this.categoryRepo.find({
      parentId: { $in: categories.map(c => c?.id) }
    }).toArray();
  }

}