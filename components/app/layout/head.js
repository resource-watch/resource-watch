import React from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

// Redux
import { connect } from 'react-redux';

import Package from '../../../package.json';

const TRANSIFEX_BLACKLIST = [
  '/app/embed/EmbedDashboard',
  '/app/embed/EmbedDataset',
  '/app/embed/EmbedLayer',
  '/app/embed/EmbedMap',
  '/app/embed/EmbedTable',
  '/app/embed/EmbedText',
  '/app/embed/EmbedWidget'
];

class Head extends React.PureComponent {
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

  getCrazyEgg() {
    return <script type="text/javascript" src="//script.crazyegg.com/pages/scripts/0069/4623.js" async="async"></script>;
  }

  getUserReport() {
    const { pathname } = this.props.routes;

    if (TRANSIFEX_BLACKLIST.includes(pathname)) {
      return null;
    }

    return (
      <script
        type="text/javascript"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: `
          window._urq = window._urq || [];
          _urq.push(['setGACode', 'UA-67196006-1']);
          _urq.push(['initSite', '085d5a65-977b-4c3d-af9f-d0a3624e276f']);
          (function() {
          var ur = document.createElement('script'); ur.type = 'text/javascript'; ur.async = true;
          ur.src = ('https:' == document.location.protocol ? 'https://cdn.userreport.com/userreport.js' : 'http://cdn.userreport.com/userreport.js');
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ur, s);
          })();
        ` }}
      />
    );
  }

  getTransifexSettings() {
    const { pathname } = this.props.routes;

    if (TRANSIFEX_BLACKLIST.includes(pathname)) {
      return null;
    }

    const TRANSIFEX_LIVE_API = process.env.TRANSIFEX_LIVE_API;
    return (
      <script
        type="text/javascript"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: `
          window.liveSettings = { api_key: '${TRANSIFEX_LIVE_API}' }
        ` }}
      />
    );
  }

  getTransifex() {
    const { pathname } = this.props.routes;

    if (TRANSIFEX_BLACKLIST.includes(pathname)) {
      return null;
    }

    return <script type="text/javascript" src="//cdn.transifex.com/live.js" />;
  }

  getAddSearchConfig() {
    const { pathname } = this.props.routes;
    const { dataset } = this.props;

    if (pathname === '/app/ExploreDetail' && dataset && !dataset.published) {
      return <meta name="robots" content="noindex" />;
    }

    return null;
  }

  getCesium() {
    const { pathname } = this.props.routes;
    if (pathname === '/app/Pulse' || pathname === '/app/Splash') {
      return <script src="/static/cesium/cesium.js" />;
    }
    return null;
  }

  getCesiumStyles() {
    const { pathname } = this.props.routes;
    if (pathname === '/app/Pulse' || pathname === '/app/Splash') {
      return <link rel="stylesheet" href="/static/cesium/Widgets/widgets.css" />;
    }
    return null;
  }

  getAFrame() {
    const { pathname } = this.props.routes;
    if (pathname === '/app/SplashDetail') {
      return <script src="/static/aframe/aframe-master.js" />;
    }
    return null;
  }

  render() {
    const { title, description, category } = this.props;

    return (
      <HeadNext>
        <title>{title ? `${title} | Resource Watch` : 'Resource Watch'}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Vizzuality" />
        {category && <meta name="addsearch-category" content={category} />}
        <link rel="icon" href="/static/favicon.ico" />
        <link rel="stylesheet" media="screen" href="https://fonts.googleapis.com/css?family=Lato:400,300,700" />
        {Head.getStyles()}
        {this.getCesiumStyles()}
        {this.getCrazyEgg()}
        {this.getUserReport()}
        {this.getTransifexSettings()}
        {this.getTransifex()}
        {this.getAddSearchConfig()}
        {this.getCesium()}
        {this.getAFrame()}
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
      </HeadNext>
    );
  }
}

Head.propTypes = {
  title: PropTypes.string, // Some pages don't have any title (think embed)
  description: PropTypes.string.isRequired,
  routes: PropTypes.object.isRequired,
  category: PropTypes.string,
  dataset: PropTypes.object
};

export default connect(
  state => ({
    dataset: state.exploreDataset.data,
    routes: state.routes
  })
)(Head);
