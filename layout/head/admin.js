import React from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

export default class HeadAdmin extends React.Component {
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
        {/* TO-DO: remove this when Axios is completely implemented */}
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />

        {/* Mobile address background */}
        {/* Chrome, Firefox OS and Opera */}
        <meta name="theme-color" content="#A5177E" />
        {/* Windows Phone */}
        <meta name="msapplication-navbutton-color" content="#A5177E" />
        {/* iOS Safari */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* leaflet styles */}
        {/* Leaflet styles are here to allow our chunk css (custom styles) override them */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css"
          integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.2/leaflet.draw.css"
          crossOrigin=""
        />
      </HeadNext>
    );
  }
}

HeadAdmin.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
