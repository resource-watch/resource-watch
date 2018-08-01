import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import numeral from 'numeral';

class MapPopup extends React.Component {
  static propTypes = {
    popup: PropTypes.object,
    data: PropTypes.object
  };

  static defaultProps = {
    popup: {},
    data: {}
  };

  formatValue(item, data) {
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

  render() {
    const {
      data,
      popup
    } = this.props;

    
    if (!data) return null;

    const {
      layers,
      layersInteraction,
      layersInteractionSelected
    } = data;

    const layer = layers.find(l => l.id === layersInteractionSelected) || layers[0];

    if (!layer) {
      popup.remove();
      return null;
    }

    const interaction = layersInteraction[layer.id] || {};
    const { data: interactionData } = interaction;
    const { interactionConfig } = layer;

    return (
      <div className="c-map-popup">
        <header className="popup-header">
          <select
            className="popup-header-select"
            name="interactionLayers"
            value={layer.id}
            onChange={e => this.props.onChangeInteractiveLayer(e.target.value)}
          >
            {layers.map(o =>
              <option key={o.id} value={o.id}>{o.name}</option>)}
          </select> 
        </header>

        <div className="popup-content">
          {interactionData &&
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
                  <td className="dd">{this.formatValue(outputItem, interactionData[outputItem.column])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }

          {!interactionData &&
            'No data available'
          }
        </div>
      </div>
    );
  }
}

export default MapPopup;
