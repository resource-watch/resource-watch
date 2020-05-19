import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

// Components
import WidgetBlock from 'components/wysiwyg/widget-block';
import PowerGenerationMap from '../power-generation-map';

// Services
import { fetchWidget } from 'services/widget';

// Constants
import { WORLD_COUNTRY } from 'layout/app/dashboard-detail/energy-country-explorer/constants';

// Styles
import './styles.scss';

function CustomSection(props) {
  const { section, user, bbox, country } = props;
  const { widgets, header, description, map, groups, mapTitle, widgetsWorld } = section;
  const countryIsWorld = !country || (country && country.value === WORLD_COUNTRY.value);
  const widgetBlocks = countryIsWorld ? 
    widgetsWorld && widgetsWorld.map(w => ({ content: { widgetId: w.id } })) :
    widgets && widgets.map(w => ({ content: { widgetId: w.id } }));
  const [data, setData] = useState({});

  console.log('countryIsWorld', countryIsWorld);
  

  useEffect(() => {
    if (widgetBlocks) {
      widgetBlocks.forEach((w) => {
        const widgetID = w.content.widgetId;
        fetchWidget(widgetID, { includes: 'metadata' })
          .then((response) => {

            console.log('response', response);
            

            setData({
              ...data,
              [widgetID]: response
            });
          })
          .catch(err => toastr.error(`Error loading widget ${widgetID}: ${err}`));
      });
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
              {widgetBlocks && widgetBlocks.map(block =>
                                  (<div className={widgetBlockClassName}>
                                    <WidgetBlock
                                      user={user}
                                      item={block}
                                      data={data}
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
  user: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired,
  bbox: PropTypes.array
};

CustomSection.defaultProps = {
  bbox: []
};

export default CustomSection;
