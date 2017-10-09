import React from 'react';
import PropTypes from 'prop-types';

import CardApp from 'components/app/common/CardApp';

const APPS = [
  {
    background: '/static/images/apps/global-forest-watch.png',
    title: 'Global Forest Watch',
    description: 'Track deforestation in near real-time. Global Forest Watch is an interactive online forest monitoring and alert system designed to empower people everywhere with the information they need to better manage and conserve forest landscapes. Global Forest Watch uses cutting edge technology and science to provide the timeliest and most precise information about the status of forest landscapes worldwide.',
    link: {
      label: 'Go to site',
      route: 'http://www.globalforestwatch.org/',
      external: true
    }
  },

  {
    background: '/static/images/apps/aqueduct-water-risk-atlas.png',
    title: 'Aqueduct Water Risk Atlas',
    description: 'Measure, map and understand water risks around the globe. Aqueduct\'s Water Risk Atlas tool helps companies, investors, governments, and other users understand where and how water risks and opportunities are emerging worldwide. The Water Risk Atlas maps aggregated scores of 12 key water indicators in 15,000 watersheds around the world.',
    link: {
      label: 'Go to site',
      route: 'http://www.wri.org/applications/maps/aqueduct-atlas/',
      external: true
    }
  },

  {
    background: '/static/images/apps/aqueduct-flood-analyzer.png',
    title: 'Aqueduct Flood Analyzer',
    description: 'Evaluate socioeconomic risks from flooding.The Aqueduct Global Flood Analyzer is a web-based interactive platform which measures river flood impacts by urban damage, affected GDP, and affected population at the country, state, and river basin scale across the globe. This tool allows users to quantify and monetize flood damage in cost-benefit analyses when evaluating and financing risk mitigation and climate adaptation projects.',
    link: {
      label: 'Go to site',
      route: 'http://floods.wri.org/',
      external: true
    }
  },

  {
    background: '/static/images/apps/climate-data-explorer.png',
    title: 'CAIT Climate Data Explorer',
    description: 'Browse comprehensive and comparable climate and emissions data. CAIT is a suite of tools that allow users to utilize the data to understand considerations of equity in climate negotiations, see transparency and available information in country climate action comitments, interact with historical emissions data, and dive into the methodologies behind future emissions projections. CAIT allows national governments, international organizations and independent researchers to perform relevant analysis and promote efficient action on climate change.',
    link: {
      label: 'Go to site',
      route: 'http://cait.wri.org/',
      external: true
    }
  },

  {
    background: '/static/images/apps/environmental-democracy-index.png',
    title: 'Environmental Democracy Index',
    description: 'Track the state of national laws protecting transparency, participation, and justice in environmental decision-making. The Environmental Democracy Index measures and maps the degree to which countries have enacted legally binding rules that provide for environmental information collection and disclosure, public participation across a range of environmental decisions, and fair, affordable, and independent avenues for seeking justice and challenging decisions that impact the environment.',
    link: {
      label: 'Go to site',
      route: 'http://www.environmentaldemocracyindex.org/',
      external: true
    }
  },

  {
    background: '/static/images/apps/landmark.png',
    title: 'LandMark',
    description: 'Map and protect indigenous and community land rights. LandMark is the first online, interactive global platform to provide maps and other critical information on lands that are collectively held and used by Indigenous Peoples and local communities. The global platform is designed to help Indigenous Peoples and communities protect their land rights and secure tenure over their lands.',
    link: {
      label: 'Go to site',
      route: 'http://www.landmarkmap.org/',
      external: true
    }
  },

  {
    background: '/static/images/apps/prep.png',
    title: 'The Partnership for Resilience and Preparedness',
    description: 'Collaborate on climate resilience data. The Partnership for Resilience and Preparedness is a data-driven approach to building climate resilience. PREP aims to help planners, investors, and resource managers more easily incorporate climate risks into their decisions by enhancing access to relevant data and facilitating collective learning. ',
    link: {
      label: 'Go to site',
      route: 'http://www.prepdata.org/',
      external: true
    }
  },

  {
    background: '/static/images/apps/descartes.png',
    title: 'Descartes Labs GeoVisual Search',
    description: 'Search for any object over the entire globe. GeoVisual Search is a computer vision tool that lets you search for any object on the globe. It processes public and commercial satellite imagery, detects visual similarities between scenes, and applies machine learning to recognize different types of objects across the globe.',
    link: {
      label: 'Go to site',
      route: 'https://search.descarteslabs.com/',
      external: true
    }
  },

  {
    background: '/static/images/apps/openaq.png',
    title: 'OpenAQ',
    description: 'Empower communities to end air inequality through open data. OpenAQ aggregates physical air quality data from public data sources provided by government, research-grade and other sources. It enables previously impossible science, impacts policy and empowers the public to fight air pollution through open data, open-source tools, and cooperation.',
    link: {
      label: 'Go to site',
      route: 'https://openaq.org/#/map?_k=xkrdbr',
      external: true
    }
  },

  {
    background: '/static/images/apps/esri.png',
    title: 'Esri Living Atlas',
    description: 'Find content for the planet. The Living Atlas of the World is the foremost collection of global geographic information from Esri and its partners, including maps, apps, and data layers used to support critical decision making.',
    link: {
      label: 'Go to site',
      route: 'https://livingatlas.arcgis.com/',
      external: true
    }
  },

  {
    background: '/static/images/apps/gee.png',
    title: 'Google Earth Engine',
    description: 'Combine imagery and algorithms for real world application. Google Earth Engine combines a multi-petabyte catalog of satellite imagery and geospatial datasets with planetary-scale analysis capabilities and makes it available for scientists, researchers, and developers to detect changes, map trends, and quantify differences on the Earth\'s surface.',
    link: {
      label: 'Go to site',
      route: 'https://earthengine.google.com/',
      external: true
    }
  },

  {
    background: '/static/images/apps/astrodigital.png',
    title: 'AstroDigital Imagery Browser',
    description: 'Search archive and future images from open and commercial satellites. AstroDigital\'s Imagery Browser enables users to search a global archive of satellite images, monitor sites now and into the future, then stream processed data into applications.',
    link: {
      label: 'Go to site',
      route: 'https://fetch.astrodigital.com/#/',
      external: true
    }
  },

  {
    background: '/static/images/apps/digitalglobe.png',
    title: 'DigitalGlobe Discover',
    description: 'Search and discover high-resolution imagery. Discover features an efficient and intuitive way to search our industry-leading high-resolution satellite imagery library to find relevant content.',
    link: {
      label: 'Go to site',
      route: 'https://discover.digitalglobe.com/',
      external: true
    }
  }
];

export default function Apps() {
  return (
    <div className="l-section">
      <div className="l-container">
        <div className="row">
          {APPS.map(app => (
            <div key={app.title} className="column small-4">
              <CardApp
                background={app.background}
                title={app.title}
                description={app.description}
                link={app.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Apps.propTypes = {
};
Apps.defaultProps = {
};
