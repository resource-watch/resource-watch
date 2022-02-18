import Document, { Html, Main, NextScript, Head } from 'next/document';

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
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap"
            rel="stylesheet"
          />

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

          <style type="text/css" dangerouslySetInnerHTML={{ __html: mediaStyles }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
