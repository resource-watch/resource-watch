import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AdapterModifier } from '@widget-editor/widget-editor';
import RWAdapter from '@widget-editor/rw-adapter';

// components
import CardIndicatorSet from './component';
import CardIndicator from './card-indicator/component';
import NumericCardIndicator from './numeric-card-indicator/component';

export default {
  title: 'Components/Card-Indicator-Set',
  component: CardIndicatorSet,
  argTypes: {},
};

const Template = (args) => {
  const { indicator, containerStyles, theme, config } = args;
  const [currentIndicator, setIndicator] = useState(indicator);
  const {
    config: { indicators },
  } = args;

  const handleClickCard = useCallback(
    (idSelected) => {
      setIndicator(indicators.find(({ id }) => idSelected === id));
    },
    [indicators],
  );

  return (
    <div
      style={{
        ...containerStyles,
        ...(theme !== 'primary' && {
          backgroundImage: 'none',
          background: '#f4f6f7',
        }),
      }}
    >
      <CardIndicatorSet
        {...args}
        indicator={currentIndicator}
        handleClickCard={handleClickCard}
        theme={theme}
      >
        {config.indicators.map(({ id, title, icon }) => (
          <CardIndicator key={id} id={id} title={title} icon={icon} theme={theme} />
        ))}
      </CardIndicatorSet>
    </div>
  );
};

Template.propTypes = {
  args: PropTypes.shape({
    containerStyles: PropTypes.shape({}),
    config: PropTypes.shape({
      indicators: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
  }).isRequired,
};

export const Default = Template.bind({});

const NumericTemplate = (args) => {
  const { indicator, containerStyles, theme, config } = args;
  const [currentIndicator, setIndicator] = useState(indicator);
  const {
    config: { indicators },
  } = args;

  const handleClickCard = useCallback(
    (idSelected) => {
      setIndicator(indicators.find(({ id }) => idSelected === id));
    },
    [indicators],
  );

  return (
    <div
      style={{
        ...containerStyles,
        background: '#fff',
      }}
    >
      <CardIndicatorSet
        {...args}
        indicator={currentIndicator}
        handleClickCard={handleClickCard}
        theme={theme}
      >
        {config.indicators.map(({ id, title, value, description, unit, format }) => (
          <NumericCardIndicator
            key={id}
            id={id}
            data={{
              id,
              unit,
              title,
              value,
              description,
              format,
            }}
            theme={theme}
            isSelected={currentIndicator.id === id}
          />
        ))}
      </CardIndicatorSet>
    </div>
  );
};

NumericTemplate.propTypes = {
  args: PropTypes.shape({
    containerStyles: PropTypes.shape({}),
    config: PropTypes.shape({
      indicators: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
  }).isRequired,
};

export const Numeric = NumericTemplate.bind({});

const commonConfig = {
  config: {
    indicators: [
      {
        id: 'marine-protected-areas',
        title: 'Marine Protected Areas',
        icon: 'marine',
        widgets: [
          {
            id: '92e5286e-b40a-4a6f-a3e5-84ac9b49d459',
          },
          {
            query:
              "https://wri-rw.carto.com/api/v2/sql?q=SELECT ROUND(CAST(value AS numeric),1) AS value FROM ocn_023_rw1_marine_protection_edit INNER JOIN gadm36_0 gadm ON iso = gadm.gid_0 WHERE year = 2021 AND unit = 'Percentage' AND gadm.{{geostore_env}} ILIKE '{{geostore_id}}'",
            text: 'Some highlight text about why this matters',
            format: '.2f',
          },
        ],
        default: true,
      },
      {
        id: 'oceans-climate',
        title: 'Oceans and Climate',
        icon: 'climate',
        widgets: [
          {
            id: 'c8c4a6cc-6ac8-43a0-b988-f26301314a55',
          },
          {
            query:
              "https://wri-rw.carto.com/api/v2/sql?q=SELECT ROUND(CAST(value AS numeric),1) AS value FROM ocn_023_rw1_marine_protection_edit INNER JOIN gadm36_0 gadm ON iso = gadm.gid_0 WHERE year = 2021 AND unit = 'Percentage' AND gadm.{{geostore_env}} ILIKE '{{geostore_id}}'",
            text: 'Some highlight text about why this matters',
            format: '.2f',
          },
        ],
      },
      {
        id: 'blue-economy',
        title: 'The Blue Economy',
        icon: 'economy',
        sections: [
          {
            title: 'section 1',
            widgets: [
              {
                id: 'fe388698-4a58-4c43-b2b1-4d169334b2e4',
              },
              {
                query:
                  "https://wri-rw.carto.com/api/v2/sql?q=SELECT ROUND(CAST(value AS numeric),1) AS value FROM ocn_023_rw1_marine_protection_edit INNER JOIN gadm36_0 gadm ON iso = gadm.gid_0 WHERE year = 2021 AND unit = 'Percentage' AND gadm.{{geostore_env}} ILIKE '{{geostore_id}}'",
                text: 'Some highlight text about why this matters',
                format: '.2f',
              },
            ],
            default: true,
          },
          {
            title: 'section 2',
            widgets: [
              {
                id: '41223a30-f4e8-4749-9b44-034443646da4',
              },
              {
                query:
                  "https://wri-rw.carto.com/api/v2/sql?q=SELECT ROUND(CAST(value AS numeric),1) AS value FROM ocn_023_rw1_marine_protection_edit INNER JOIN gadm36_0 gadm ON iso = gadm.gid_0 WHERE year = 2021 AND unit = 'Percentage' AND gadm.{{geostore_env}} ILIKE '{{geostore_id}}'",
                text: 'Some highlight text about why this matters',
                format: '.2f',
              },
            ],
          },
        ],
      },
      {
        id: 'land-sea-interface',
        title: 'The Land/Sea Interface',
        icon: 'land-sea',
        widgets: [
          {
            id: '5eec6ec5-51e5-4d39-af23-9d1cda64dc3a',
          },
          {
            query:
              "https://wri-rw.carto.com/api/v2/sql?q=SELECT ROUND(CAST(value AS numeric),1) AS value FROM ocn_023_rw1_marine_protection_edit INNER JOIN gadm36_0 gadm ON iso = gadm.gid_0 WHERE year = 2021 AND unit = 'Percentage' AND gadm.{{geostore_env}} ILIKE '{{geostore_id}}'",
            text: 'Some highlight text about why this matters',
            format: '.2f',
          },
        ],
      },
      {
        id: 'ocean-dependence',
        title: 'Ocean Dependence',
        icon: 'dependence',
        widgets: [
          {
            id: '4a54273c-0529-4da1-a935-f3de4738ca3e',
          },
          {
            query:
              "https://wri-rw.carto.com/api/v2/sql?q=SELECT ROUND(CAST(value AS numeric),1) AS value FROM ocn_023_rw1_marine_protection_edit INNER JOIN gadm36_0 gadm ON iso = gadm.gid_0 WHERE year = 2021 AND unit = 'Percentage' AND gadm.{{geostore_env}} ILIKE '{{geostore_id}}'",
            text: 'Some highlight text about why this matters',
            format: '.2f',
          },
        ],
      },
      {
        id: 'biodiversity',
        title: 'Biodiversity',
        icon: 'biodiversity',
        widgets: [
          {
            id: 'f5a86ecb-e5d9-470e-ba57-33b3d0912881',
          },
          {
            query:
              "https://wri-rw.carto.com/api/v2/sql?q=SELECT ROUND(CAST(value AS numeric),1) AS value FROM ocn_023_rw1_marine_protection_edit INNER JOIN gadm36_0 gadm ON iso = gadm.gid_0 WHERE year = 2021 AND unit = 'Percentage' AND gadm.{{geostore_env}} ILIKE '{{geostore_id}}'",
            text: 'Some highlight text about why this matters',
            format: '.2f',
          },
        ],
      },
    ],
  },
  params: {
    iso: 'BRA',
    geostore_env: 'geostore_prod',
    geostore_id: '9bc50cce7f5b6ebd0452a3b839708ba9',
  },
  isInACollection: false,
  indicator: {
    id: 'marine-protected-areas',
    title: 'Marine Protected Areas',
    icon: 'marine',
    widgets: [
      {
        id: '92e5286e-b40a-4a6f-a3e5-84ac9b49d459',
      },
      {
        query:
          "https://wri-rw.carto.com/api/v2/sql?q=SELECT ROUND(CAST(value AS numeric),1) AS value FROM ocn_023_rw1_marine_protection_edit INNER JOIN gadm36_0 gadm ON iso = gadm.gid_0 WHERE year = 2021 AND unit = 'Percentage' AND gadm.{{geostore_env}} ILIKE '{{geostore_id}}'",
        text: 'Some highlight text about why this matters',
        format: '.2f',
      },
    ],
    default: true,
  },
  RWAdapter: AdapterModifier(RWAdapter, {
    endpoint: `${process.env.NEXT_PUBLIC_WRI_API_URL}/v1`,
    env: process.env.NEXT_PUBLIC_API_ENV,
    applications: process.env.NEXT_PUBLIC_APPLICATIONS.split(','),
    locale: 'en',
  }),
  containerStyles: {
    padding: 50,
    backgroundImage:
      "url('/static/images/components/layout/header-bg-texture.png'), linear-gradient(137.52deg, #c32d7b 0%, #0F4573 100%)",
  },
  theme: 'primary',
};

Default.args = commonConfig;

Numeric.args = {
  ...commonConfig,
  config: {
    ...commonConfig.config,
    indicators: [
      {
        id: 'lorem-1',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        value: '150',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        unit: 'ha',
        widgets: commonConfig.config.indicators[0].widgets,
      },
      {
        id: 'lorem-2',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        value: '77.3%',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        widgets: commonConfig.config.indicators[1].widgets,
      },
      {
        id: 'lorem-3',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        value: '1500',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        sections: commonConfig.config.indicators[2].sections,
        format: '~s',
      },
      {
        id: 'lorem-4',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        value: '0.9%',
        widgets: commonConfig.config.indicators[3].widgets,
      },
      {
        id: 'lorem-5',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        value: '35%',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        widgets: commonConfig.config.indicators[4].widgets,
      },
      {
        id: 'lorem-6',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        value: '8.9Km',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        widgets: commonConfig.config.indicators[5].widgets,
      },
    ],
  },
  indicator: {
    id: 'lorem-1',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    value: '34%',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    widgets: [
      {
        id: '50c3fb9c-cef3-4533-8ae7-9ad122bb7963',
      },
      {
        query:
          "https://wri-rw.carto.com/api/v2/sql?q=SELECT ROUND(CAST(value AS numeric),1) AS value FROM ocn_023_rw1_marine_protection_edit INNER JOIN gadm36_0 gadm ON iso = gadm.gid_0 WHERE year = 2021 AND unit = 'Percentage' AND gadm.{{geostore_env}} ILIKE '{{geostore_id}}'",
        text: 'Some highlight text about why this matters',
        format: '.2f',
      },
    ],
    default: true,
  },
};
