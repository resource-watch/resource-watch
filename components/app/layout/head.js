import React from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';
import Package from '../../../package';

// Styles
import styles from 'css/index.scss';

export default class Head extends React.Component {

  render() {
    const { title, description } = this.props;

    let stylesheet;
    if (process.env.NODE_ENV === 'production') {
      // In production, serve pre-built CSS file from /assets/{version}/main.css
      stylesheet = <link rel="stylesheet" type="text/css" href={`/assets/${Package.version}/main.css`} />;
    } else {
      // In development, serve CSS inline (with live reloading) with webpack
      // NB: Not using dangerouslySetInnerHTML will cause problems with some CSS
      stylesheet = <style dangerouslySetInnerHTML={{ __html: styles }} />;
    }

    return (
      <HeadNext>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Vizzuality" />
        <link rel="icon" href="/static/favicon.ico" />
        <link rel="stylesheet" media="screen" href="https://fonts.googleapis.com/css?family=Lato:400,300,700" />
        {stylesheet}
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
      </HeadNext>
    );
  }

}

Head.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
