// TO-DO: replace with components/map/popup
import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash/isEmpty';

import moment from 'moment';
import numeral from 'numeral';

import { replace } from 'layer-manager';

import Spinner from 'components/ui/Spinner';

class LayerPopup extends React.Component {
  static propTypes = {
    latlng: PropTypes.object,
    popup: PropTypes.object,
    data: PropTypes.object,
    onChangeInteractiveLayer: PropTypes.func.isRequired
  };

  static defaultProps = {
    latlng: {},
    popup: {},
    data: {}
  };

  state = {
    loading: true,
    interaction: {}
  }

  componentDidMount() {
    const { latlng, data } = this.props;

    const {
      layers,
      layersInteractionSelected
    } = data;

    const layer = layers.find(l => l.id === layersInteractionSelected) || layers[0];

    if (!layer) return false;

    const { interactionConfig } = layer;

    if (
      !isEmpty(latlng) &&
      !!layers.length &&
      !!interactionConfig.config &&
      !!interactionConfig.config.url
    ) {
      fetch(replace(interactionConfig.config.url, latlng))
        .then((response) => {
          if (response.ok) return response.json();
          throw response;
        })
        .then(({ data }) => {
          this.setState({
            interaction: {
              ...this.state.interaction,
              [layer.id]: {
                ...layer,
                data: data[0]
              }
            },
            loading: false
          });
        })
        .catch((err) => {
          this.setState({ loading: false });
          if (err && err.json && typeof err.json === 'function') {
            err.json()
              .then((er) => {
                console.error(er);
              });
          }
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  }

  formatValue(item, data) {
    if (item.type === 'date' && item.format && data) {
      data = moment(data).format(item.format);
    } else if (item.type === 'number' && item.format && (data || data === 0)) {
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

    const { interactionConfig } = layer;
    const { output } = interactionConfig;

    // Get data from props or state
    const interaction = layersInteraction[layer.id] || {};
    const interactionState = this.state.interaction[layer.id] || {};

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
          {(interaction.data || interactionState.data) &&
            <table className="popup-table">
              <tbody>
                {output.map((outputItem) => {
                  const { column } = outputItem;
                  const columnArray = column.split('.');
                  const value = columnArray.reduce((acc, c) => acc[c],
                    interaction.data || interactionState.data);
                    return (
                      <tr
                        className="dc"
                        key={outputItem.property || outputItem.column}
                      >
                        <td className="dt">
                          {outputItem.property || outputItem.column}:
                        </td>
                        <td className="dd">{this.formatValue(outputItem, value)}</td>
                      </tr>
                    );
                  }
              )}
              </tbody>
            </table>
          }

          {this.state.loading && (!interaction.data || !interactionState.data) && interactionConfig.config && interactionConfig.config.url &&
            <div className="popup-loader">
              <Spinner isLoading className="-tiny -inline -pink-color" />
            </div>
          }

          {!this.state.loading && (!interaction.data && !interactionState.data) && interactionConfig.config && interactionConfig.config.url &&
            'No data available'
          }


          {(!interaction.data && !interactionState.data) && (!interactionConfig.config || !interactionConfig.config.url) &&
            'No data available'
          }
        </div>
      </div>
    );
  }
}

export default LayerPopup;
