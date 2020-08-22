import * as hbs from 'hbs';

hbs.registerHelper('switch', function (value, options) {
  this.switch_value = value;
  return options.fn(this);
});

hbs.registerHelper('case', function (value, options) {
  if (value == this.switch_value) {
    this.switch_matched = true;
    return options.fn(this);
  }
});

hbs.registerHelper('default', function (options) {
  if (!this.switch_matched) {
    return options.fn(this);
  }
});