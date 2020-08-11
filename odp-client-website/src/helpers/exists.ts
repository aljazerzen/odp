import { HelperOptions } from 'handlebars';
import * as hbs from 'hbs';

hbs.registerHelper('exists', function (value, options: HelperOptions) {
  return value !== null && value !== undefined;
});