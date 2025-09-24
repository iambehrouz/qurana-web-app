// https://vike.dev/onRenderHtml
export { onRenderHtml };

import { renderToString as renderToString_ } from "@vue/server-renderer";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import { createApp } from "./app";
import logoUrl from "./../assets/images/logo.png";
import { getPageTitle } from "./getPageTitle";

async function onRenderHtml(pageContext) {
  // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
  // onRenderHtml() to support SPA
  if (!pageContext.Page)
    throw new Error("My render() hook expects pageContext.Page to be defined");

  const app = createApp(pageContext);

  const appHtml = await renderToString(app);

  // https://vike.dev/head
  const title = getPageTitle(pageContext);
  const desc =
    pageContext.data?.description ||
    pageContext.config.description ||
    "Demo of using Vike";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16937446886">
        </script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-16937446886');
        </script>

        <!-- Event snippet for Contact conversion page -->
        <script>
          gtag('event', 'conversion', {'send_to': 'AW-16937446886/y4rACNHP6rUaEObbs4w_'});
        </script>


        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="crossorigin=""/>
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="crossorigin=""></script>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
    },
  };
}

async function renderToString(app) {
  let err;
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    err = err_;
  };
  const appHtml = await renderToString_(app);
  if (err) throw err;
  return appHtml;
}
