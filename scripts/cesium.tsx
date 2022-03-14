import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function CesiumScript() {
  const { pathname } = useRouter();
  const isPulsePage = useMemo(() => pathname === '/data/pulse', [pathname]);

  return (
    <>
      <Script
        src="/static/cesium/cesium.js"
        strategy={isPulsePage ? 'beforeInteractive' : 'afterInteractive'}
      />
      <Script
        src="/static/cesium/cesium-navigation.js"
        strategy={isPulsePage ? 'beforeInteractive' : 'lazyOnload'}
      />
      <Head>
        <link rel="stylesheet" href="/static/cesium/navigation.css" />
        <link rel="stylesheet" href="/static/cesium/Widgets/widgets.css" />
      </Head>
    </>
  );
}
