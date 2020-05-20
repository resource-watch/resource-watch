import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

// Components
import DashboardWidgetCard from 'layout/app/dashboard-detail/dashboard-widget-card';
import PowerGenerationMap from '../power-generation-map';

// Services
import { fetchWidget } from 'services/widget';

// Constants
import { WORLD_COUNTRY } from 'layout/app/dashboard-detail/energy-country-explorer/constants';

// Styles
import './styles.scss';

function CustomSection(props) {
  const { section, bbox, country } = props;
  const { widgets, header, description, map, groups, mapTitle, widgetsWorld } = section;
  const countryIsWorld = !country || (country && country.value === WORLD_COUNTRY.value);
  const widgetBlocks = countryIsWorld ?
    widgetsWorld && widgetsWorld.map(w => w.id) :
    widgets && widgets.map(w => w.id);
  const [data, setData] = useState(null);
  const [widgetsLoading, setWidgetsLoading] = useState(false);

  useEffect(() => {
    if (widgetBlocks) {
      const promises = widgetBlocks.map(id => fetchWidget(id, { includes: 'metadata' }));
      Promise.all(promises)
        .then((responses) => {
          if (!countryIsWorld) {
            const reducedResult = responses.reduce((acc, resp) => {              
              const key = resp.widgetConfig.sql_config[0].key_params[0].key;
              const isISO = key === 'country_code';
              const dataObj = resp.widgetConfig.data[0];
              const newDataObj = {
                ...dataObj,
                url: dataObj.url.replace(new RegExp(
                  '{{where}}', 'g'), `WHERE ${key} IN ('${isISO ? country.value : country.label}')`)
              };                 

              const newWidgetConfig = {
                ...resp.widgetConfig,
                data: [newDataObj]
              };

              const newWidget = {
                ...resp,
                widgetConfig: newWidgetConfig
              }

              return ({ ...acc, [resp.id]: newWidget });
            }, {});

            setData(reducedResult);
          } else {
            setData(responses.reduce((acc, resp) => ({ ...acc, [resp.id]: resp }), {}));
          }
          setWidgetsLoading(false);
        })
        .catch(err => toastr.error(`Error loading widget ${err}`));
    }
  }, [country]);

  const widgetBlockClassName = classnames({
    column: true,
    'small-12': true,
    'medium-6': countryIsWorld ?
      widgetsWorld && widgetsWorld[0].widgetsPerRow === 2 :
      widgets && widgets[0].widgetsPerRow === 2,
    'large-4': countryIsWorld ?
      widgetsWorld && widgetsWorld[0].widgetsPerRow === 3 :
      widgets && widgets[0].widgetsPerRow === 3
  });  

  return (
    <div className="c-custom-section l-section">
      <div className="l-container">
        <div className="row">
          <div className="column small-12">
            <div className="text-container">
              <h2>{header}</h2>
              <p>{description}</p>
            </div>
            {!map &&
              <div className="row">
                {widgetBlocks && widgetBlocks.map(id =>
                  (<div className={widgetBlockClassName}>
                    <DashboardWidgetCard
                      widget={data && data[id]}
                      loading={widgetsLoading}
                    />
                  </div>))}
              </div>
            }
            {map &&
              <PowerGenerationMap
                groups={groups}
                mapTitle={mapTitle}
                bbox={bbox}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

CustomSection.propTypes = {
  section: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired,
  bbox: PropTypes.array
};

CustomSection.defaultProps = {
  bbox: []
};

export default CustomSection;
