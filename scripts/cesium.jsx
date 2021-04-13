import React from 'react';
import Head from 'next/head';

export default function CesiumScript() {
  return (
    <Head>
      <script src="/static/cesium/cesium.js" />
      <script src="/static/cesium/cesium-navigation.js" />
      <link rel="stylesheet" href="/static/cesium/navigation.css" />
      <link rel="stylesheet" href="/static/cesium/Widgets/widgets.css" />
    </Head>
  );
}
