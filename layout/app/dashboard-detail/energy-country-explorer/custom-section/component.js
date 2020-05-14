import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

// Components
import WidgetBlock from 'components/wysiwyg/widget-block';
import PowerGenerationMap from '../power-generation-map';

// Services
import { fetchWidget } from 'services/widget';


function CustomSection(props) {
  const { section, user, bbox } = props;
  const { widgets, header, description, map, groups, mapTitle } = section;
  const [widgetBlocks, setWidgetBlocks] = useState(widgets && widgets.map(w => ({ content: { widgetId: w } })));
  const [data, setData] = useState({});

  useEffect(() => {
    if (widgets) {
      widgets.forEach((w) => {
        fetchWidget(w, { includes: 'metadata' })
          .then((response) => {
            setData({
              ...data,
              [w]: response
            });
          })
          .catch(err => toastr.error(`Error loading widget ${w}`, err));
      });
    }
  }, [widgets]);

  const widgetBlockClassName = classnames({
    column: true,
    'small-12': true,
    'medium-6': widgets && widgets.length > 1,
    'large-4': widgets && widgets.length > 2
  });  

  return (
    <div className="c-custom-section l-section">
      <div className="l-container">
        <div className="row">
          <div className="column small-12">
            <h2>{header}</h2>
            <p>{description}</p>
            {!map &&
            <div className="row">
              {widgetBlocks.map(block =>
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
  bbox: PropTypes.array
};

CustomSection.defaultProps = {
  bbox: []
};

export default CustomSection;
