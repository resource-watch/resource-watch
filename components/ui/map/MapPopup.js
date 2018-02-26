import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import numeral from 'numeral';

function MapPopup({
  interaction,
  interactionSelected,
  interactionLayers,
  onChangeInteractiveLayer
}) {
  const layer =
    interactionLayers.find(l => l.id === interactionSelected) ||
    interactionLayers[0];

  const layerInteraction = interaction[layer.id] || {};

  const { data, interactionConfig } = layerInteraction;

  function formatValue(item, value) {
    if (!item.format || typeof item.format !== 'string') return `${item.prefix}${value}${item.suffix}`;

    if (item.type === 'date') {
      value = moment(value, item.format);
    } else if (item.type === 'number') {
      value = numeral(value).format(item.format);
    }

    return `${item.prefix}${value}${item.suffix}`;
  }

  return (
    <div className="c-map-popup">
      <header className="popup-header">
        <select
          className="popup-header-select"
          name="interactionLayers"
          value={layer.id}
          onChange={e => onChangeInteractiveLayer(e.target.value)}
        >
          {interactionLayers.map(o =>
            <option key={o.id} value={o.id}>{o.name}</option>
          )}
        </select>

        {/* <button className="">
          <Icon
            name="icon-close"
            className="-default"
          />
        </button> */}
      </header>

      <div className="popup-content">
        {data &&
          <table className="popup-table">
            <tbody>
              {Object.keys(data).map((d) => {
                const outputItem = interactionConfig.output.find(o => o.column === d) || {};
                return (
                  <tr
                    className="dc"
                    key={d}
                  >
                    <td className="dt">
                      {outputItem.property || d}:
                    </td>
                    <td className="dd">{formatValue(outputItem, data[d])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        }

        {!data &&
          'No data available'
        }
      </div>
    </div>
  );
}

MapPopup.propTypes = {
  interaction: PropTypes.object,
  interactionLayers: PropTypes.array,
  interactionSelected: PropTypes.string,
  onChangeInteractiveLayer: PropTypes.func
};

export default MapPopup;
