import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import numeral from 'numeral';


function _formatValue(item, data) {
  if (item.type === 'date' && item.format && data) {
    data = moment(data).format(item.format);
  } else if (item.type === 'number' && item.format && data) {
    data = numeral(data).format(item.format);
  }

  function removeHtmlTags(str) {
    if (!str || !str.toString) return str;
    return str.toString().replace(/<\/?[a-z]+>/gi, '');
  }

  return `${item.prefix || ''}${removeHtmlTags(data) || '-'}${item.suffix || ''}`;
}

function MapPopup({
  interaction,
  interactionSelected,
  interactionLayers,
  onChangeInteractiveLayer
}) {
  const layer =
    interactionLayers.find(l => l.id === interactionSelected) ||
    interactionLayers[0];

  if (!layer) {
    return null;
  }

  const layerInteraction = interaction[layer.id] || {};

  const { data } = layerInteraction;
  const { interactionConfig } = layer;

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
            <option key={o.id} value={o.id}>{o.name}</option>)}
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
              {interactionConfig.output.map((outputItem, key) => (
                <tr
                  className="dc"
                  key={key}
                >
                  <td className="dt">
                    {outputItem.property || outputItem.column}:
                  </td>
                  <td className="dd">{_formatValue(outputItem, data[outputItem.column])}</td>
                </tr>
                ))}
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
