import React from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

import Package from '../../package.json';

export default class Head extends React.Component {
  static getStyles() {
    if (process.env.NODE_ENV === 'production') {
      // In production, serve pre-built CSS file from /styles/{version}/main.css
      return <link rel="stylesheet" type="text/css" href={`/styles/${Package.version}/main.css`} />;
    }
    // In development, serve CSS inline (with live reloading) with webpack
    // NB: Not using dangerouslySetInnerHTML will cause problems with some CSS
    /* eslint-disable */
    return <style dangerouslySetInnerHTML={{ __html: require('css/index.scss') }} />;
    /* eslint-enable */
  }

  render() {
    const { title, description } = this.props;

    return (
      <HeadNext>
        <title>{title} | RW Content Manager</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Vizzuality" />
        <link rel="icon" href="/static/favicon.ico" />
        <link rel="stylesheet" media="screen" href="https://fonts.googleapis.com/css?family=Lato:400,300,700" />
        {Head.getStyles()}
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />

        {/* Mobile Adress background */}
        {/* Chrome, Firefox OS and Opera */}
        <meta name="theme-color" content="#A5177E" />
        {/* Windows Phone */}
        <meta name="msapplication-navbutton-color" content="#A5177E" />
        {/* iOS Safari */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Leaflet CDN */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css"
          integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js"
          integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw=="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/esri-leaflet@2.1.3/dist/esri-leaflet.js"
          integrity="sha512-pijLQd2FbV/7+Jwa86Mk3ACxnasfIMzJRrIlVQsuPKPCfUBCDMDUoLiBQRg7dAQY6D1rkmCcR8286hVTn/wlIg=="
          crossOrigin=""
        />

      </HeadNext>
    );
  }
}

Head.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
