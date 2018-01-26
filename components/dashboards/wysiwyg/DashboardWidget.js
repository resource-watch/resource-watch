import React from 'react';
import PropTypes from 'prop-types';
import 'isomorphic-fetch';

// Components
import TextChart from 'components/widgets/charts/TextChart';
import VegaChart from 'components/widgets/charts/VegaChart';
import Map from 'components/ui/map/Map';
import Legend from 'components/ui/Legend';

import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';

// Redux
import { connect } from 'react-redux';

// Utils
import getChartTheme from 'utils/widgets/theme';
import LayerManager from 'utils/layers/LayerManager';

class DashboardWidget extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,

    // Redux
    user: PropTypes.object.isRequired
  };

  static defaultProps = {
    item: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null, // Error message
      loading: false,
      widget: {}, // Widget
      layers: [] // Map's layers
    };
  }

  /**
   * LIFECYCLE
  */
  componentDidMount() {
    if (this.props.item.content.widgetId) {
      this.getData(this.props.item.content.widgetId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.content.widgetId !== this.props.item.content.widgetId) {
      this.getData(nextProps.item.content.widgetId);
    }
  }

  /**
   * UI EVENTS
   * - onToggleLayerGroupVisibility
   *   Event handler executed when the user toggles the
   *   visibility of a layer group
   *   @param {LayerGroup} layerGroup - Layer group to toggle
  */
  onToggleLayerGroupVisibility = (layerGroup) => {
    const layerGroups = this.state.layers.map((l) => {
      if (l.dataset !== layerGroup.dataset) return l;
      return Object.assign({}, l, { visible: !layerGroup.visible });
    });

    this.setState({ layers: [...layerGroups] });
  }

  /**
   * HELPERS
   * - getData
   * - getLayer
   * - getWidgetType
  */
  getData(widgetId) {
    this.setState({ loading: true });

    fetch(`${process.env.WRI_API_URL}/widget/${widgetId}?&application=${process.env.APPLICATIONS}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then(({ data }) => {
        this.setState({
          widget: { id: data.id, ...data.attributes }
        }, () => {
          // If the widget is a map, we also fetch its layer
          if (data.attributes.widgetConfig.type && data.attributes.widgetConfig.type === 'map') {
            this.getLayer();
          }
        });
      })
      // TODO error message
      .catch(err => this.setState({ error: err.message }));
  }

  getLayer() {
    // At this point, loading is still true
    const { widgetConfig } = this.state.widget;

    fetch(`${process.env.WRI_API_URL}/layer/${widgetConfig.layer_id}?&application=${process.env.APPLICATIONS}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then(({ data }) => {
        this.setState({
          layers: [{
            dataset: data.attributes.dataset,
            visible: true,
            layers: [{
              id: data.id,
              active: true,
              ...data.attributes
            }]
          }]
        });
      })
      .catch(err => this.setState({ error: err.message }))
      // We remove the loader because the map will render
      // right away
      .then(() => this.setState({ loading: false }));
  }

  /**
   * Return the type of widget
   * @returns {'vega'|'map'|'text'}
  */
  getWidgetType() {
    const { widgetConfig } = this.state.widget;
    return (widgetConfig && widgetConfig.type) || 'vega';
  }


  render() {
    const { widget } = this.state;

    // Type of the widget: "vega", "text" or "map"
    const widgetType = this.getWidgetType();

    return (
      <div
        role="button"
        className="c-dashboard-card"
        onClick={this.props.onSelect}
      >
        <header>
          <div className="header-container">
            <Title className="-default">{widget.name || '–'}</Title>

            {/* <button
              onClick={this.handleFavouriteClick}
            >
              <Icon name={`icon-${iconName}`} className="c-icon -small" />
            </button> */}
          </div>
          {/* <ul className="categories">
            {this.props.categories.map(category => <li key={category}>{category}</li>)}
          </ul> */}
        </header>

        <div className="widget-container">
          <Spinner isLoading={this.state.loading} className="-light -small" />

          {!this.state.error && widgetType === 'text' &&
            <TextChart
              widgetConfig={widget.widgetConfig}
              toggleLoading={loading => this.setState({ loading })}
            />
          }

          {!this.state.error && widget.widgetConfig && widgetType === 'vega' &&
            <VegaChart
              data={widget.widgetConfig}
              theme={getChartTheme()}
              toggleLoading={loading => this.setState({ loading })}
              reloadOnResize
            />
          }

          {!this.state.error && widget.widgetConfig && widgetType === 'map' && this.state.layers && (
            <div>
              <Map
                LayerManager={LayerManager}
                mapConfig={{}}
                layerGroups={this.state.layers}
              />
              <Legend
                layerGroups={this.state.layers}
                className={{ color: '-dark' }}
                toggleLayerGroupVisibility={
                  layerGroup => this.onToggleLayerGroupVisibility(layerGroup)
                }
                setLayerGroupsOrder={() => {}}
                setLayerGroupActiveLayer={() => {}}
                expanded={false}
                readonly
              />
            </div>
          )}

          {!this.state.error && !this.props.item && !this.props.item.content.widgetId
            && <div className="message">
              <div className="no-data">No data</div>
            </div>
          }

          {this.state.error &&
            <div className="message">
              <div className="error">Unable to load the widget <span>{this.state.error}</span></div>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  favourites: state.user.favourites.items
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardWidget);
