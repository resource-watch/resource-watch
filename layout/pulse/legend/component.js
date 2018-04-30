import React from 'react';
import PropTypes from 'prop-types';
import { LegendItemTypes } from 'wri-api-components';

function Legend(props) {
  if (props.layerActive) {
    return (
      <div className="c-legend">
        <div className="l-container">
          <ul className="c-legend-list">
            <li className="c-legend-item">
              <header className="legend-item-header">
                <h3 className={props.className.color}>
                  <span className="name">{props.layerActive.name}</span>
                </h3>
              </header>

              <LegendItemTypes
                activeLayer={{ ...props.layerActive, ...props.layerActive.attributes }}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return null;
}

Legend.propTypes = {
  layerActive: PropTypes.object,
  className: PropTypes.object
};

// Legend.defaultProps = {
//   layerActive: null,
//   className: {}
// };

export default Legend;
