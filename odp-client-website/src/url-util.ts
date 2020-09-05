import { Request } from 'express';
import * as url from 'url';

export const DEFAULT_SOURCE_URL = 'odp://46.101.247.207:3000';

export function mapProtocol(mapping: { [from: string]: string }) {
  return (input: string) => {
    const u = url.parse(input);
    u.protocol = mapping[u.protocol];
    if (!u.protocol) return null;

    return url.format(u);
  };
}

export const urlHttpToOdp = mapProtocol({ 'http:': 'odp:', 'https:': 'odps:' });
export const urlOdpToHttp = mapProtocol({ 'odp:': 'http:', 'odps:': 'https:' });

export function extractOdpUrl(req: Request) {
  return req.cookies?.source ?? DEFAULT_SOURCE_URL;
}

export function prependRelativeUrl(prefix) {
  return relativeUrl => {
    const u = url.parse(relativeUrl);
    return (!u.hostname && !u.port ? prefix : '') + relativeUrl;
  };
}