import { HttpService, Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

import { Category, FieldFormat, FieldType } from './category.dto';

function stripPrefix(prefix: string) {
  return (value: string) => {
    if (value.startsWith(prefix)) return value.substring(prefix.length);
    return value;
  };
}

@Injectable()
export class CategoryService {

  loaded = false;
  resolvedCategories: {
    [id: string]: {
      childrenNames: string[],
      fields?: { [field: string]: FieldFormat },
    }
  } = {};

  constructor(
    private http: HttpService
  ) {
  }

  async load() {
    if (this.loaded) return;
    const res = await this.http.get('https://www.iglusport.si/').toPromise();

    const $ = cheerio.load(res.data);

    this.resolvedCategories = {};

    const topCategories: string[] = $('#mainmenu').children('ul').children('li').toArray()
      .map((categoryElement) => {
        const [categoryName] = [$(categoryElement).children('a').attr('href')]
          .map(stripPrefix('https://www.iglusport.si/'));

        const categoryChildren: string[] = $(categoryElement).find('ul.nav-submenu.level0')
          .children('li')
          .toArray()
          .map((subcategoryElement) => {
            const [subCategoryName] = [$(subcategoryElement).children('a').attr('href')]
              .map(stripPrefix('https://www.iglusport.si/'))
              .map(stripPrefix(categoryName + '/'));

            const subCategoryChildren: string[] = $(subcategoryElement).find('ul.nav-submenu.level1')
              .children('li').toArray()
              .map(subSubElement => {
                const [subSubCategoryName] = [$(subSubElement).children('a').attr('href')]
                  .map(stripPrefix('https://www.iglusport.si/'))
                  .map(stripPrefix(categoryName + '/'))
                  .map(stripPrefix(subCategoryName + '/'));

                this.resolvedCategories[categoryName + '.' + subCategoryName + '.' + subSubCategoryName] = {
                  childrenNames: []
                };
                return subSubCategoryName;
              });

            this.resolvedCategories[categoryName + '.' + subCategoryName] = {
              childrenNames: subCategoryChildren,
            };

            return subCategoryName;
          });

        this.resolvedCategories[categoryName] = {
          childrenNames: categoryChildren
        };

        return categoryName;
      });

    this.resolvedCategories.$ = {
      childrenNames: topCategories
    };
    this.loaded = true;
  }

  async resolveCategory(path: string): Promise<Category> {
    if (path.startsWith('$')) path = path.substring(1);
    if (path.startsWith('.')) path = path.substring(1);
    if (path === '') path = '$';

    await this.load();

    await this.fetchCategoryFields(path);

    return {
      fields: {},
      ...(this.resolvedCategories[path] || {}),
      path
    };
  }

  // async resolveCategory(path: string): Promise<Category> {

  //   if (!this.resolvedCategories[path]) {
  //     const parentPath = path.includes('.') ? path.substring(0, path.lastIndexOf('.')) : '$';
  //     const categoryName = path.substring(path.lastIndexOf('.') + 1);

  //     const parent = await this.resolveCategory(parentPath);

  //     this.resolvedCategories[path] = await this.fetchCategory(parent, categoryName);
  //   }

  //   return this.resolvedCategories[path] as Category;
  // }

  // async fetchCategory(parent: Category, categoryName: string): Promise<Category> {
  //   const res = await this.http.get('https://www.mimovrste.com/' + categoryName.replace('--', '/')).toPromise();

  //   const $ = cheerio.load(res.data);

  //   const subcategories = $('ul.nav-secondary--secondary').children('li').children('a')
  //     .map(function (index, el) { return $(this).attr('href') })
  //     .get()
  //     // remove slash
  //     .map(n => n.substring(1).replace('/', '--'));

  //   const fields = $('.sidebar-filter--item')
  //     .map(function (index, el) {
  //       // console.log($(this).find('h4').text());
  //       return $(this).attr('href')
  //     })

  //   return {
  //     path: parent.path !== '' ? parent.path + '.' + categoryName : categoryName,
  //     childrenNames: subcategories,
  //     fields: {

  //     }
  //   } as Category;
  // }

  async fetchCategoryFields(path: string) {
    if (!this.resolvedCategories[path]) this.resolvedCategories[path] = { childrenNames: [] };
    const category = this.resolvedCategories[path];
    if (!!category.fields) return;

    if (path.split('.').length < 3) return;

    const url = 'https://www.iglusport.si/' + path.replace(/[.]/g, '/');
    const res = await this.http.get(url).toPromise();

    const $ = cheerio.load(res.data);

    category.fields = {};

    $('.filter-options-item').each((_, element) => {
      const title = $(element).children('.filter-options-title');
      const fieldName = title.text();
      const [id] = title.attr('class').split(' ').filter(a => a !== 'filter-options-title');

      const items = $(element).find('.items').get(0);

      let members: string[] | undefined;
      let memberIds: string[] | undefined;
      let isQueryParam = false;

      if (items.name === 'ul') {
        members = $(items).find('li.item')
          .map((_index, el) => $(el).children('a').attr('href'))
          .get()
          .map(stripPrefix(url))
          .map(stripPrefix('/'))
          .filter(m => m.length > 0);
      }

      if (items.name === 'ol') {
        members = $(items).find('li.item .label')
          .map((_index, el) => $(el).text())
          .get();

        const memberUrls = $(items).find('li.item')
          .map((_index, el) => $(el).children('a').attr('href'))
          .get()
          .map(stripPrefix(url));

        if (memberUrls[0] && memberUrls[0].startsWith('?')) {
          memberIds = memberUrls.map(stripPrefix(`?${id}=`));
          isQueryParam = true;
        } else {
          memberIds = memberUrls.map(stripPrefix('/'));
        }
      }

      if (members) {
        if (id === 'cat') {
          category.childrenNames = members;
        } else {
          if (!!category.fields) {
            category.fields[fieldName] = {
              type: FieldType.CATEGORICAL,
              categorical: { members },
              _internal: {
                id,
                memberIds,
                isQueryParam
              }
            }
          }
        }
      }
    });
  }


}

export interface ResolvedCategoryMap { [id: string]: Category | null }