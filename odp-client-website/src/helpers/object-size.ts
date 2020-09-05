import * as hbs from 'hbs';

hbs.registerHelper('objectSize', function (a) {
  return Object.keys(a ?? {}).length;
});