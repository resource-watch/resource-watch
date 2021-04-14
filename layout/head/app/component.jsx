import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// constants
import {
  CESIUM_ROUTES,
  HOTJAR_ROUTES,
} from 'constants/app';

const CrazyEggScript = dynamic(() => import('../../../scripts/crazyegg'), { ssr: false });
const UserReportScript = dynamic(() => import('../../../scripts/userreport'), { ssr: false });
const HotjarScript = dynamic(() => import('../../../scripts/hotjar'), { ssr: false });
const GoogleAnalyticsV4Script = dynamic(() => import('../../../scripts/google-analytics-v4'), { ssr: false });
const CesiumScript = dynamic(() => import('../../../scripts/cesium'));

export default function HeadApp({
  title,
  description,
  hostname,
  explicitHostname,
  thumbnail,
}) {
  const {
    asPath,
  } = useRouter();
  const isProduction = process.env.NEXT_PUBLIC_RW_ENV === 'production';
  const isHotjarRoute = useMemo(() => HOTJAR_ROUTES
    .filter((route) => asPath.startsWith(route)).length > 0,
  [asPath]);
  const isCesiumRoute = useMemo(() => CESIUM_ROUTES.includes(asPath), [asPath]);

  return (
    <>
      <HeadNext>
        <title>{title ? `${title} | Resource Watch` : 'Resource Watch'}</title>

        <meta property="og:url" content={explicitHostname || hostname} />
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
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.2/leaflet.draw.css"
          crossOrigin=""
        />
      </HeadNext>
      {isProduction && (
        <>
          <CrazyEggScript />
          <UserReportScript />
          {isHotjarRoute && <HotjarScript />}
        </>
      )}
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_V4_ID && (<GoogleAnalyticsV4Script />)}
      {isCesiumRoute && (<CesiumScript />)}
    </>
  );
}

HeadApp.defaultProps = {
  title: null,
  description: null,
  thumbnail: 'https://resourcewatch.org/static/images/social-big.jpg',
  explicitHostname: null,
};

HeadApp.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  thumbnail: PropTypes.string,
  hostname: PropTypes.string.isRequired,
  explicitHostname: PropTypes.string,
};
