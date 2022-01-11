import Document, { Html, Main, NextScript, Head } from 'next/document';
import Script from 'next/script';

// lib
import { mediaStyles } from 'lib/media';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="author" content="Vizzuality" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap"
            rel="stylesheet"
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

          {/* Google API */}
          <Script
            src={`https://maps.googleapis.com/maps/api/js?v=weekly&key=${process.env.NEXT_PUBLIC_RW_GOGGLE_API_TOKEN_SHORTENER}&libraries=places`}
          />

          <style
            type="text/css"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: mediaStyles }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
