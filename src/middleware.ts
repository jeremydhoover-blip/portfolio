import { defineMiddleware } from 'astro:middleware';
import { parseHTML } from 'linkedom';
// @ts-ignore - plain JS module
import { colorblock } from './theme/colorblock.mjs';

// Applies the color-block layout to every rendered HTML page.
// Runs per request in `astro dev` and once per page at build, so production stays static HTML.
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const type = response.headers.get('content-type') ?? '';
  if (!type.includes('text/html')) return response;
  const html = await response.text();
  const { document } = parseHTML(html);
  if (!document.body || !document.querySelector('main')) return new Response(html, response);
  colorblock(document, context.url.pathname);
  const out = '<!doctype html>\n' + document.documentElement.outerHTML;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(out, { status: response.status, statusText: response.statusText, headers });
});
