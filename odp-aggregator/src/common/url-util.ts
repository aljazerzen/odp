import * as url from 'url';

export function prependRelativeUrl(prefix) {
  return relativeUrl => {
    const u = url.parse(relativeUrl);
    return (!u.hostname && !u.port ? prefix : '') + relativeUrl;
  };
}