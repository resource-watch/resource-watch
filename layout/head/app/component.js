import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

// constants
import { CESIUM_ROUTES, HOTJAR_ROUTES } from 'constants/app';

class HeadApp extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    routes: PropTypes.object.isRequired,
    hostname: PropTypes.string.isRequired,
    explicitHostname: PropTypes.string
  };

  static defaultProps = {
    title: null,
    description: null,
    thumbnail: 'https://resourcewatch.org/static/images/social-big.jpg',
    explicitHostname: null
  }

  getCrazyEgg() {
    if (process.env.RW_NODE_ENV === 'production' && typeof window !== 'undefined') {
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
    if (process.env.RW_NODE_ENV === 'production' && typeof window !== 'undefined') {
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
          <link rel="stylesheet" href="/static/cesium/navigation.css" />
          <link rel="stylesheet" href="/static/cesium/Widgets/widgets.css" />
        </Fragment>
      );
    }

    return null;
  }

  getHotJar() {
    const { routes: { pathname } } = this.props;
    const isProduction = process.env.RW_NODE_ENV === 'production';
    const isBrowser = typeof window !== 'undefined';
    const isRouteIncluded = 
      HOTJAR_ROUTES.filter(route => pathname.startsWith(route)).length > 0;    

    if (isProduction && isBrowser && isRouteIncluded) {
      return (
        // Hotjar Tracking Code for https://resourcewatch.org/ -->
        <script
          type="text/javascript"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:1798352,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}}
        />  
      );
    }
  }

  render() {
    const {
      title,
      description,
      thumbnail,
      hostname,
      explicitHostname
    } = this.props;
    return (
      <HeadNext>
        <title>{title ? `${title} | Resource Watch` : 'Resource Watch'}</title>

        <meta property="og:url" content={explicitHostname ? explicitHostname : hostname} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="og:image" content={thumbnail} />
        <meta property="og:image:secure_url" content={thumbnail} />
        <meta name="og:image:alt" content={`${title}_widget`} />

        {/* leaflet styles */}
        {/* Leaflet styles are here to allow our chunk css (custom styles) override them */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossorigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.2/leaflet.draw.css"
          crossOrigin=""
        />

        {this.getCesium()}
        {this.getCrazyEgg()}
        {this.getUserReport()}
        {this.getHotJar()}
      </HeadNext>
    );
  }
}

export default HeadApp;
