import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';
import { connect } from 'react-redux';

// constants
import { TRANSIFEX_BLACKLIST, USERREPORT_BLACKLIST } from 'constants/app';

class Head extends PureComponent {
  static propTypes = {
    // some pages don't have any title (think embed)
    title: PropTypes.string,
    description: PropTypes.string.isRequired,
    routes: PropTypes.object.isRequired,
    category: PropTypes.string
  };

  static defaultProps = {
    title: null,
    category: null
  }

  static getStyles() {
    return <link rel="stylesheet" type="text/css" href="/_next/static/style.css" />;
  }

  getCrazyEgg() {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      return <script type="text/javascript" src="//script.crazyegg.com/pages/scripts/0069/4623.js" async="async" />;
    }
    return null;
  }

  getUserReport() {
    const { routes } = this.props;
    const { pathname } = routes;

    if (USERREPORT_BLACKLIST.includes(pathname)) return null;

    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      return (
        <script
          type="text/javascript"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              window._urq = window._urq || [];
              _urq.push(['setGACode', 'UA-67196006-1']);
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

  getTransifexSettings() {
    const { pathname } = this.props.routes;

    if (TRANSIFEX_BLACKLIST.includes(pathname)) {
      return null;
    }

    return (
      <script
        type="text/javascript"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            window.liveSettings = { api_key: '${process.env.TRANSIFEX_LIVE_API}' }
          `
        }}
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

  getCesium() {
    const { pathname } = this.props.routes;
    if (pathname === '/app/pulse' || pathname === '/app/Splash') {
      return (
        <fragment>
          <script src="/static/cesium/cesium.js" />
          <script src="/static/cesium/cesium-navigation.js" />
        </fragment>
      );
    }
    return null;
  }

  getCesiumStyles() {
    const { pathname } = this.props.routes;
    if (pathname === '/app/pulse' || pathname === '/app/Splash') {
      return <link rel="stylesheet" href="/static/cesium/Widgets/widgets.css" />;
    }
    return null;
  }

  getAFrame() {
    const { pathname } = this.props.routes;
    if (pathname === '/app/SplashDetail') {
      return <script src="/static/aframe/aframe.min.js" />;
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
        <link rel="stylesheet" media="screen" href="/static/styles/add-search-results.css" />

        {/* Mobile Adress background */}
        {/* Chrome, Firefox OS and Opera */}
        <meta name="theme-color" content="#c32d7b" />
        {/* Windows Phone */}
        <meta name="msapplication-navbutton-color" content="#c32d7b" />
        {/* iOS Safari */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Social metadata */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://resourcewatch.org/static/images/social-big.jpg" />
        <meta property="og:url" content="https://resourcewatch.org" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@resource_watch" />

        {/* Leaflet CDN */}
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
        <script
          src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js"
          integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw=="
          crossOrigin=""
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.2/leaflet.draw.js"
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/esri-leaflet@2.1.3/dist/esri-leaflet.js"
          integrity="sha512-pijLQd2FbV/7+Jwa86Mk3ACxnasfIMzJRrIlVQsuPKPCfUBCDMDUoLiBQRg7dAQY6D1rkmCcR8286hVTn/wlIg=="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet-utfgrid/L.UTFGrid-min.js"
          crossOrigin=""
        />

        {Head.getStyles()}
        {this.getCesiumStyles()}
        {this.getCrazyEgg()}
        {this.getUserReport()}
        {/* {this.getTransifexSettings()}
        {this.getTransifex()} */}
        {this.getCesium()}
        {this.getAFrame()}

        <script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.RW_GOGGLE_API_TOKEN_SHORTENER}&libraries=places`} />
        <script
          src={`https://maps.googleapis.com/maps/api/js?v=3.35&key=${
            process.env.RW_GOGGLE_API_TOKEN_SHORTENER
            }&libraries=places`}
        />
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
      </HeadNext>
    );
  }
}

export default connect(
  state => ({ routes: state.routes }),
  null
)(Head);
