import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';

// Components
import DashboardWidgetCard from 'layout/app/dashboard-detail/dashboard-widget-card';

// Services
import { fetchWidget } from 'services/widget';

// Constants
import { WORLD_COUNTRY, US_COUNTRY_VALUES } from 'layout/app/dashboard-detail/energy-country-explorer/constants';
import MiniExplore from 'components/mini-explore';

function CustomSection(props) {
  const {
    section, bbox, country, geostore,
  } = props;
  const {
    widgets,
    header,
    description,
    visualizationType,
    widgetsWorld,
  } = section;
  const countryIsWorld = !country || (country && country.value === WORLD_COUNTRY.value);
  const widgetBlocks = countryIsWorld ? widgetsWorld : widgets;
  const [data, setData] = useState(null);
  const [widgetsLoading, setWidgetsLoading] = useState(true);
  const isMiniExplore = visualizationType === 'mini-explore';

  useEffect(() => {
    if (widgetBlocks) {
      const promises = widgetBlocks.map((wB) => fetchWidget(wB.id, { includes: 'metadata' }));
      Promise.all(promises)
        .then((responses) => {
          if (!countryIsWorld) {
            const reducedResult = responses.reduce((acc, resp) => {
              if (resp.widgetConfig.type === 'embed') {
                const { url } = resp.widgetConfig;
                if (url.indexOf('map-swipe') >= 0) {
                  const newURL = `${url}&bbox=[${bbox}]`;
                  const newWidgetConfig = {
                    ...resp.widgetConfig,
                    url: newURL,
                  };
                  return ({
                    ...acc,
                    [resp.id]: {
                      ...resp,
                      widgetConfig: newWidgetConfig,
                    },
                  });
                }
                return ({ ...acc, [resp.id]: resp });
              } if (resp.widgetConfig.type === 'ranking') {
                // temporary implementation for ranking widgets
                let countryName = country.label;

                // --- This patch is necessary since this country name varies for some datasets ----
                if (country.label === US_COUNTRY_VALUES.nameFoundInSource) {
                  countryName = US_COUNTRY_VALUES.newNameForQueries;
                }

                const newURL = resp.widgetConfig.url.replace(new RegExp(
                  '{{country}}', 'g',
                ), `'${countryName}'`);

                const newWidgetConfig = {
                  ...resp.widgetConfig,
                  url: newURL,
                };

                const newWidget = {
                  ...resp,
                  widgetConfig: newWidgetConfig,
                };

                return ({ ...acc, [resp.id]: newWidget });
              }
              const { paramsConfig } = resp.widgetConfig;
              const visualizationTypeWidget = paramsConfig && paramsConfig.visualizationType;
              if (!visualizationTypeWidget || visualizationTypeWidget === 'chart') {
                const { key } = resp.widgetConfig.sql_config[0].key_params[0];
                const isISO = key === 'country_code';
                const dataObj = resp.widgetConfig.data[0];
                let countryName = country.label;

                // --- This patch is necessary since this country name varies for some datasets ----
                if (country.label === US_COUNTRY_VALUES.nameFoundInSource) {
                  countryName = US_COUNTRY_VALUES.newNameForQueries;
                }

                const newDataObj = {
                  ...dataObj,
                  url: dataObj.url.replace(new RegExp(
                    '{{where}}', 'g',
                  ), `WHERE ${key} IN ('${isISO ? country.value : countryName}')`),
                };

                const newWidgetConfig = {
                  ...resp.widgetConfig,
                  data: [newDataObj, ...resp.widgetConfig.data.slice(1, dataObj.length)],
                };

                const newWidget = {
                  ...resp,
                  widgetConfig: newWidgetConfig,
                };

                return ({ ...acc, [resp.id]: newWidget });
              } if (visualizationTypeWidget === 'map') {
                // Replacing Bounding box with that from the selected country
                const newWidgetConfig = {
                  ...resp.widgetConfig,
                  bbox,
                };
                const newWidget = {
                  ...resp,
                  widgetConfig: newWidgetConfig,
                };
                return ({ ...acc, [resp.id]: newWidget });
              }

              return ({ ...acc });
            }, {});

            setData(reducedResult);
          } else {
            setData(responses.reduce((acc, resp) => ({ ...acc, [resp.id]: resp }), {}));
          }
          setWidgetsLoading(false);
        })
        .catch((err) => {
          toastr.error(`Error loading widget ${err}`);
          console.error(err);
        });
    }
  }, [country, bbox, countryIsWorld, widgetBlocks]);

  const miniExploreConfig = useMemo(() => ({
    title: section.title,
    ...geostore && { areaOfInterest: geostore },
    ...['USA', 'World'].includes(country.value) && { forcedBbox: bbox },
    datasetGroups: section.datasetGroups,
  }), [section, geostore, country, bbox]);

  return (
    <div className="c-custom-section l-section">
      <div className="l-container">
        <div className="row">
          <div className="column small-12">
            <div className="text-container">
              <h2>{header}</h2>
              <ReactMarkdown linkTarget="_blank" source={description} />
            </div>
            {(!isMiniExplore && !widgetsLoading)
              && (
              <div className="row widget-blocks">
                {widgetBlocks && widgetBlocks.map((wB) => {
                  const widgetBlockClassName = classnames({
                    column: true,
                    'small-12': true,
                    'medium-6': wB.widgetsPerRow === 2,
                    'large-4': wB.widgetsPerRow === 3,
                  });

                  if (!data[wB.id]) return null;
                  return (
                    <div className={widgetBlockClassName}>
                      <DashboardWidgetCard
                        widget={data[wB.id]}
                        loading={false}
                        key={`dashboard-widget-card-${wB.id}`}
                        explicitHeight={wB.explicitHeight}
                      />
                    </div>
                  );
                })}
              </div>
              )}
            {isMiniExplore && (
              <MiniExplore
                config={miniExploreConfig}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
CustomSection.defaultProps = {
  bbox: [],
  geostore: null,
};

CustomSection.propTypes = {
  section: PropTypes.shape({
    header: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    visualizationType: PropTypes.string,
    title: PropTypes.string.isRequired,
    datasetGroups: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    widgets: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    widgetsWorld: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
  }).isRequired,
  country: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  bbox: PropTypes.arrayOf(
    PropTypes.number,
  ),
  geostore: PropTypes.string,
};

export default CustomSection;
