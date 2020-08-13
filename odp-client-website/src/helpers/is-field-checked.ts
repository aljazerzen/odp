import * as hbs from 'hbs';

hbs.registerHelper('isFieldChecked', function(query, key, value, options) {
  const queryVal = query['f.' + key];
  const queryArrayVal = (Array.isArray(queryVal) ? queryVal : [queryVal]);
  return queryArrayVal.includes(value);
});