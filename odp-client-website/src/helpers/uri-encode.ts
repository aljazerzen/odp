import * as hbs from 'hbs';

hbs.registerHelper('uriEncode', function (a, options) {
  return encodeURIComponent(a);
});