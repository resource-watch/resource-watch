import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

class HeadError extends PureComponent {
  static propTypes = {
    statusCode: PropTypes.number.isRequired,
    hostname: PropTypes.string.isRequired
  }

  render() {
    const { statusCode, hostname } = this.props;

    return (
      <HeadNext>
        <title>{`${statusCode} | Resource Watch`}</title>
        <meta property="og:url" content={hostname} />
        <meta name="description" content="Ops, something went wrong" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Vizzuality" />

        {/* Mobile Adress background */}
        {/* Chrome, Firefox OS and Opera */}
        <meta name="theme-color" content="#c32d7b" />
        {/* Windows Phone */}
        <meta name="msapplication-navbutton-color" content="#c32d7b" />
        {/* iOS Safari */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      </HeadNext>
    );
  }
}

export default HeadError;
