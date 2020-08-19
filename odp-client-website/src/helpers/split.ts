import { createFrame, HelperOptions } from 'handlebars';
import * as hbs from 'hbs';

hbs.registerHelper('split', function (fullString: string, splitter, options: HelperOptions) {
  const parts = fullString?.split(splitter) ?? [];

  const res = [];
  const data = options.data ? createFrame(options.data) : undefined;

  for (const [index, part] of parts.entries()) {
    if (data) {
      data.index = index;
      data.last = index === parts.length - 1;
      data.first = index === 0;
    }

    res.push(
      options.fn({ part, prefix: parts.slice(0, index).join(splitter) }, { data })
    );
  }

  return res.join('');
});