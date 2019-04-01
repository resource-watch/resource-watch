import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

// constants
import {
  CESIUM_ROUTES,
  USERREPORT_BLACKLIST
} from 'constants/app';

class HeadApp extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    routes: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: null,
    description: null,
    thumbnailUrl: 'https://resourcewatch.org/static/images/social-big.jpg'
  }

  getCrazyEgg() {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      return (
        <script
          type="text/javascript"
          src="//script.crazyegg.com/pages/scripts/0069/4623.js"
          async="async"
        />
      );
    }
    return null;
  }

  getUserReport() {
    const { routes: { pathname } } = this.props;

    if (USERREPORT_BLACKLIST.includes(pathname)) return null;

    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      return (
        <script
          type="text/javascript"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              window._urq = window._urq || [];
              _urq.push(['setGACode', '${process.env.GOOGLE_ANALYTICS}']);
              _urq.push(['initSite', '085d5a65-977b-4c3d-af9f-d0a3624e276f']);
              (function() {
              var ur = document.createElement('script');
              ur.type = 'text/javascript';
              ur.async = true;
              ur.src = ('https:' == document.location.protocol ? 'https://cdn.userreport.com/userreport.js' : 'http://cdn.userreport.com/userreport.js');
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(ur, s);
              })();
            `
          }}
        />
      );
    }

    return null;
  }

  getCesium() {
    const { routes: { pathname } } = this.props;

    if (CESIUM_ROUTES.includes(pathname)) {
      return (
        <Fragment>
          <script src="/static/cesium/cesium.js" />
          <script src="/static/cesium/cesium-navigation.js" />
          <link rel="stylesheet" href="/static/cesium/Widgets/widgets.css" />
        </Fragment>
      );
    }

    return null;
  }

  getAFrame() {
    const { routes: { pathname } } = this.props;
    if (pathname === '/splash') return <script src="/static/aframe/aframe.min.js" />;
    return null;
  }

  render() {
    const {
      title,
      description,
      thumbnailUrl
    } = this.props;
    return (
      <HeadNext>
        <title>{title ? `${title} | Resource Watch` : 'Resource Watch'}</title>

        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="og:image" content={thumbnailUrl} />
        <meta name="og:image:alt" content={`${title}_widget`} />

        {this.getCesium()}
        {this.getCrazyEgg()}
        {this.getUserReport()}
        {this.getAFrame()}
      </HeadNext>
    );
  }
}

export default HeadApp;
