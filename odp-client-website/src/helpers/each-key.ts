import * as hbs from 'hbs';

hbs.registerHelper('eachKey', function (context, options) {
  let ret = '';

  for (let key in context) {
    ret = ret + options.fn({ key, value: context[key] });
  }

  return ret;
});