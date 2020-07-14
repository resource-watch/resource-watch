import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { replace } from 'layer-manager';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import numeral from 'numeral';
import axios from 'axios';

// components
import Spinner from 'components/ui/Spinner';

// styles
import './styles.scss';

class LayerPopup extends PureComponent {
  static propTypes = {
    latlng: PropTypes.object,
    data: PropTypes.object,
    onChangeInteractiveLayer: PropTypes.func.isRequired
  };

  static defaultProps = {
    latlng: {},
    data: {}
  };

  state = {
    loading: true,
    interaction: {}
  }

  componentWillMount() {
    const { latlng, data: popupData } = this.props;
    const {
      layers,
      layersInteractionSelected
    } = popupData;
    const layer = layers.find(_layer => _layer.id === layersInteractionSelected) || layers[0];

    if (layer) {
      const { interactionConfig } = layer;

      if (
        !isEmpty(latlng) &&
        !!layers.length &&
        !!interactionConfig.config &&
        !!interactionConfig.config.url
      ) {
        this.fetchDataUrl(layer, latlng);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      data: { layersInteractionSelected: nextLayersInteractionSelected },
      latlng: nextLatLng
    } = nextProps;
    const {
      data: popupData,
      latlng
    } = this.props;

    const { layers } = popupData;
    const layer = layers.find(_layer => _layer.id === nextLayersInteractionSelected) || layers[0];

    if (layer) {
      const { interactionConfig } = layer;

      if (
        !isEmpty(latlng) &&
        !!layers.length &&
        !!interactionConfig.config &&
        !!interactionConfig.config.url
      ) {
        this.fetchDataUrl(layer, nextLatLng);
      }
    }
  }

  fetchDataUrl(layer, latlng) {
    const { interactionConfig } = layer;
    const { interaction } = this.state;
    this.setState({
      loading: true,
      interaction: {
        ...interaction,
        [layer.id]: {}
      }
    }, () => {
      axios.get(replace(interactionConfig.config.url, latlng))
        .then(({ data }) => {
          const { data: _data } = data;
          const { interaction: currentInteractions } = this.state;
          this.setState({
            interaction: {
              ...currentInteractions,
              [layer.id]: { data: _data[0] }
            },
            loading: false
          });
        })
        .catch((err) => {
          this.setState({ loading: false });
          if (err && err.json && typeof err.json === 'function') {
            err.json()
              .then((er) => { console.error(er); });
          }
        })
        .finally(() => { this.setState({ loading: false }); });
    });
  }

  formatValue(item, data) {
    if (item.type === 'date' && item.format && data) {
      data = moment(data).format(item.format);
    } else if (item.type === 'number' && item.format && (data || data ===0)) {
      data = numeral(data).format(item.format);
    }

    function removeHtmlTags(str) {
      if (!str || !str.toString) return str;
      return str.toString().replace(/<\/?[a-z]+>/gi, '');
    }

    return `${item.prefix || ''}${removeHtmlTags(data) || '-'}${item.suffix || ''}`;
  }

  render() {
    const { data } = this.props;

    const {
      layers,
      layersInteraction,
      layersInteractionSelected
    } = data;

    const layer = layers.find(l => l.id === layersInteractionSelected) || layers[0];

    if (!layer) return null;

    const { interactionConfig } = layer;
    const { output } = interactionConfig;

    // Get data from props or state
    const interaction = layersInteraction[layer.id] || {};
    const interactionState = this.state.interaction[layer.id] || {};

    return (
      <div className="c-layer-popup">
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
            output.map((outputItem) => {
              const { column } = outputItem;
              const columnArray = column.split('.');
              const value = columnArray.reduce((acc, c) => acc[c],
                interaction.data || interactionState.data);
                return (
                  <div
                    className="popup-field"
                    key={outputItem.property || outputItem.column}
                  >
                    <div className="field-title">
                      {outputItem.property || outputItem.column}
                    </div>
                    <div className="field-value">
                      {(outputItem.property || outputItem.column) === 'Link' &&
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {value}
                        </a>
                      }
                      {(outputItem.property || outputItem.column) !== 'Link' &&
                        this.formatValue(outputItem, value)}
                    </div>
                  </div>
                );
              })
          }

          {this.state.loading && (!interaction.data || !interactionState.data) &&
            interactionConfig.config && interactionConfig.config.url &&
            <div className="popup-loader">
              <Spinner isLoading className="-tiny -inline -pink-color" />
            </div>}

          {!this.state.loading && (!interaction.data && !interactionState.data) &&
            interactionConfig.config && interactionConfig.config.url &&
            'No data available'}


          {(!interaction.data && !interactionState.data) &&
            (!interactionConfig.config || !interactionConfig.config.url) &&
            'No data available'}
        </div>
      </div>
    );
  }
}

export default LayerPopup;
