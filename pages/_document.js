import React from 'react';
import Document, { Main, NextScript, Head } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="author" content="Vizzuality" />
          <link rel="icon" href="/static/favicon.ico" />
          <link
            rel="stylesheet"
            media="screen"
            href="https://fonts.googleapis.com/css?family=Lato:400,300,700"
          />
          <link rel="stylesheet" media="screen" href="/static/styles/add-search-results.css" />

          {/* Mobile address background */}
          {/* Chrome, Firefox OS and Opera */}
          <meta name="theme-color" content="#c32d7b" />
          {/* Windows Phone */}
          <meta name="msapplication-navbutton-color" content="#c32d7b" />
          {/* iOS Safari */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

          {/* Social metadata */}
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@resource_watch" />
          <meta property="fb:app_id" content="Resource Watch" />

          {/* Leaflet CDN */}
          {/* leaflet script necessary for the Widget Editor */}
          <script
            src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
            integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
            crossorigin=""
          />
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.2/leaflet.draw.js"
            crossOrigin=""
          />
          <script
            src="https://unpkg.com/esri-leaflet@2.1.3/dist/esri-leaflet.js"
            integrity="sha512-pijLQd2FbV/7+Jwa86Mk3ACxnasfIMzJRrIlVQsuPKPCfUBCDMDUoLiBQRg7dAQY6D1rkmCcR8286hVTn/wlIg=="
            crossOrigin=""
          />
          <script
            src="https://unpkg.com/leaflet-utfgrid/L.UTFGrid-min.js"
            crossOrigin=""
          />

          {/* Google API */}
          <script
            src={`https://maps.googleapis.com/maps/api/js?v=weekly&key=${
              process.env.RW_GOGGLE_API_TOKEN_SHORTENER
              }&libraries=places`}
          />

          {/* Polifyll */}
          {/* TO-DO: remove once axios is completely implemented */}
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
