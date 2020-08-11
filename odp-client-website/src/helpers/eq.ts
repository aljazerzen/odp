import * as hbs from 'hbs';

hbs.registerHelper('eq', function(a, b, options) {
  return a === b;
});