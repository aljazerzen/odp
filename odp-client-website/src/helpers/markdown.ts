import * as markdownIt from '@hackmd/markdown-it';
import { HelperOptions } from 'handlebars';
import * as hbs from 'hbs';

const md = new markdownIt();

hbs.registerHelper('markdown', function (markdown: string, options: HelperOptions) {
  return md.render(markdown ?? '');
});