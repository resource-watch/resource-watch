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
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          media="screen"
          href="https://fonts.googleapis.com/css?family=Lato:400,300,700"
          display="swap"
        />

        {/* Mobile address background */}
        {/* Chrome, Firefox OS and Opera */}
        <meta name="theme-color" content="#A5177E" />
        {/* Windows Phone */}
        <meta name="msapplication-navbutton-color" content="#A5177E" />
        {/* iOS Safari */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </HeadNext>
    );
  }
}

HeadAdmin.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
