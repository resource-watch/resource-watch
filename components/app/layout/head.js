import React from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

// Styles
import styles from 'css/index.scss';

export default class Head extends React.Component {

  static getStyles() {
    // if (process.env.NODE_ENV === 'production') {
    //   // In production, serve pre-built CSS file from /styles/{version}/main.css
    //   return <link rel="stylesheet" type="text/css" href={`/styles/${Package.version}/index.css`} />;
    // }
    // In development, serve CSS inline (with live reloading) with webpack
    // NB: Not using dangerouslySetInnerHTML will cause problems with some CSS
    return <style dangerouslySetInnerHTML={{ __html: styles }} />;
  }

  render() {
    const { title, description } = this.props;

    return (
      <HeadNext>
        <title>{title ? `${title} | Resource Watch` : 'Resource Watch'}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Vizzuality" />
        <link rel="icon" href="/static/favicon.ico" />
        <link rel="stylesheet" media="screen" href="https://fonts.googleapis.com/css?family=Lato:400,300,700" />
        {Head.getStyles()}
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
      </HeadNext>
    );
  }

}

Head.propTypes = {
  title: PropTypes.string, // Some pages don't have any title (think embed)
  description: PropTypes.string.isRequired
};
