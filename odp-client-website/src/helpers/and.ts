import * as hbs from 'hbs';

hbs.registerHelper('and', function(a, b, options) {
  return a && b;
});