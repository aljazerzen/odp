import { HelperOptions } from 'handlebars';
import * as hbs from 'hbs';

hbs.registerHelper('removePrefix', function (value: string, prefix: string, options: HelperOptions) {
  if(value.startsWith(prefix)) {
    return value.substring(prefix.length);
  }
  return value;
});