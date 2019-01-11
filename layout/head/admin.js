import React from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

export default class Head extends React.Component {
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
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js" />
        <script src="https://unpkg.com/esri-leaflet/dist/esri-leaflet.js" />
        <script src="https://unpkg.com/leaflet-utfgrid/L.UTFGrid-min.js" />

      </HeadNext>
    );
  }
}

Head.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
