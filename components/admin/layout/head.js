import React from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

// Styles
import styles from 'css/index.scss';

export default class Head extends React.Component {
  static getStyles() {
    // In development, serve CSS inline (with live reloading) with webpack
    // NB: Not using dangerouslySetInnerHTML will cause problems with some CSS
    return <style dangerouslySetInnerHTML={{ __html: styles }} />;
  }

  render() {
    const { title, description } = this.props;
    const TRANSIFEX_LIVE_API = process.env.TRANSIFEX_LIVE_API;

    return (
      <HeadNext>
        <title>{title} | RW Content Manager</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Vizzuality" />
        <link rel="icon" href="/static/favicon.ico" />
        <link rel="stylesheet" media="screen" href="https://fonts.googleapis.com/css?family=Lato:400,300,700" />
        {Head.getStyles()}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: `
            window.liveSettings = { api_key: '${TRANSIFEX_LIVE_API}' }
          ` }}
        />
        <script type="text/javascript" src="//cdn.transifex.com/live.js" />
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
      </HeadNext>
    );
  }
}

Head.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
