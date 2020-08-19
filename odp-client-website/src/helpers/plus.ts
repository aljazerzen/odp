import * as hbs from 'hbs';

hbs.registerHelper('plus', function (a, b, options) {
  return a + b;
});