import { HelperOptions } from 'handlebars';
import * as hbs from 'hbs';
import { moneyAggregate, moneyMultiply } from 'src/money-util';

hbs.registerHelper('cartTotal', function (cart: any[], options: HelperOptions) {
  return moneyAggregate(cart.map(i => moneyMultiply(i?.amount ?? 0)(i.offer.price)));
});