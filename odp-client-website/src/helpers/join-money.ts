import { HelperOptions } from 'handlebars';
import * as hbs from 'hbs';

hbs.registerHelper('joinMoney', function (money: any[], splitter, options: HelperOptions) {
  return (money ?? []).map(m => m?.amount > 0 ? m?.amount + ' ' + m?.currency ?? '?' : '').join(', ');
});