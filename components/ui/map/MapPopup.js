import React from 'react';
import PropTypes from 'prop-types';

import Title from 'components/ui/Title';

function MapPopup(props) {
  const { name, data, interactionConfig } = props.layer;
  const { output } = interactionConfig;
  console.log(output);

  return (
    <div className="c-map-popup">
      <Title className="-small">
        {name}
      </Title>

      {data &&
        <dl className="dl">
          {Object.keys(data).map((d) => {
            const outputItem = output.find(o => o.column === d) || {};

            return (
              <div
                className="dc"
                key={d}
              >
                <dt className="dt">
                  {outputItem.property || d}:
                </dt>
                <dd className="dd">{data[d]}</dd>
              </div>
            );
          })}
        </dl>
      }
    </div>
  );
}

MapPopup.propTypes = {
  layer: PropTypes.object
};

export default MapPopup;
