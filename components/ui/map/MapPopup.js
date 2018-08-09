import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import numeral from 'numeral';

class MapPopup extends React.Component {
  static propTypes = {
    interaction: PropTypes.object,
    interactionLayers: PropTypes.array,
    interactionSelected: PropTypes.string,
    onChangeInteractiveLayer: PropTypes.func
  };

  formatValue(item, value) {
    let data = value;

    if (item.type === 'date' && item.format && value) {
      data = moment(value).format(item.format);
    } else if (item.type === 'number' && item.format && value) {
      if (item.format === '0,0%' || item.format === '0,0[.0]%') {
        data = numeral(value / 100).format(item.format);
      } else {
        data = numeral(value).format(item.format);
      }
    }

    function removeHtmlTags(str) {
      if (!str || !str.toString) return str;
      return str.toString().replace(/<\/?[a-z]+>/gi, '');
    }

    return `${item.prefix || ''}${removeHtmlTags(data) || '-'}${item.suffix || ''}`;
  }

  render() {
    const {
      interaction,
      interactionSelected,
      interactionLayers,
      onChangeInteractiveLayer
    } = this.props;

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
                {interactionConfig.output.map(outputItem => (
                  <tr
                    className="dc"
                    key={outputItem.property || outputItem.column}
                  >
                    <td className="dt">
                      {outputItem.property || outputItem.column}:
                    </td>
                    <td className="dd">{this.formatValue(outputItem, data[outputItem.column])}</td>
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
}

export default MapPopup;
