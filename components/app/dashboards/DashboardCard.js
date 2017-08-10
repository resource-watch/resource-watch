import React from 'react';
import PropTypes from 'prop-types';
import 'isomorphic-fetch';
import { Autobind } from 'es-decorators';

// Components
import Title from 'components/ui/Title';
import TextChart from 'components/widgets/TextChart';
import VegaChart from 'components/widgets/VegaChart';
import Map from 'components/vis/Map';
import Legend from 'components/ui/Legend';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/Icon';

// Redux
import { connect } from 'react-redux';

// Utils
import getChartTheme from 'utils/widgets/theme';
import LayerManager from 'utils/layers/LayerManager';

// Services
import UserService from 'services/UserService';

class DashboardCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null, // Error message
      loading: false,
      name: null, // Name of the widget
      widgetConfig: null, // Vega config of the widget
      layers: [], // Map's layers
      isFavourite: props.isFavourite
    };

    // Services
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentDidMount() {
    if (this.props.widgetId) {
      this.getData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFavourite !== this.state.isFavourite) {
      this.setState({
        isFavourite: nextProps.isFavourite
      });
    }
  }

  /**
   * Event handler executed when the user toggles the
   * visibility of a layer group
   * @param {LayerGroup} layerGroup - Layer group to toggle
   */
  onToggleLayerGroupVisibility(layerGroup) {
    const layerGroups = this.state.layers.map((l) => {
      if (l.dataset !== layerGroup.dataset) return l;
      return Object.assign({}, l, { visible: !layerGroup.visible });
    });

    this.setState({ layers: [...layerGroups] });
  }

  /**
   * Fetch the widget's data and set a few properties in the
   * state once done
   */
  getData() {
    this.setState({ loading: true });

    fetch(`${process.env.WRI_API_URL}/widget/${this.props.widgetId}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then(({ data }) => {
        this.setState({
          name: data.attributes.name,
          widgetConfig: data.attributes.widgetConfig
        }, () => {
          // If the widget is a map, we also fetch its layer
          if (data.attributes.widgetConfig.type && data.attributes.widgetConfig.type === 'map') {
            this.getLayer();
          }
        });
      })
      .catch(err => this.setState({ error: err.message }));
      // TODO error message
  }

  /**
   * Fetch the map's layer if the widget is a map and store it
   * in the state
   * NOTE: you should only call this method if you're sure the
   * widget is a map and its config has been loaded
   */
  getLayer() {
    // At this point, loading is still true
    const widgetConfig = this.getWidgetConfig();

    fetch(`${process.env.WRI_API_URL}/layer/${widgetConfig.layer_id}`)
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
   * Return the widget config
   * @returns {object}
   */
  getWidgetConfig() {
    return (this.props.data && this.props.data.attributes.widgetConfig)
      || this.state.widgetConfig;
  }

  /**
   * Return the type of widget
   * @returns {'vega'|'map'|'text'}
   */
  getWidgetType() {
    const widgetConfig = this.getWidgetConfig();
    return (widgetConfig && widgetConfig.type) || 'vega';
  }

  @Autobind
  handleFavouriteClick() {
    const { isFavourite, widgetId, user } = this.props;
    this.setState({
      loading: true
    });
    if (isFavourite) {
      this.userService.deleteFavourite(isFavourite.id, user.token)
        .then(() => {
          this.setState({
            isFavourite: false,
            loading: false
          });
        }
      ).catch(err => console.error(err));
    } else {
      this.userService.createFavouriteWidget(widgetId, user.token)
        .then(() => {
          this.setState({
            isFavourite: true,
            loading: false
          });
        }
      ).catch(err => console.error(err));
    }
  }

  render() {
    const { isFavourite } = this.state;
    const widgetConfig = this.getWidgetConfig();

    // Type of the widget: "vega", "text" or "map"
    const widgetType = (widgetConfig && widgetConfig.type) || 'vega';

    const iconName = (isFavourite && isFavourite.id) ? 'star-full' : 'star-empty';

    return (
      <div className="c-dashboard-card">
        <header>
          <div className="header-container">
            <Title className="-default">{this.state.name || this.props.name || '–'}</Title>
            <button
              onClick={this.handleFavouriteClick}
            >
              <Icon name={`icon-${iconName}`} className="c-icon -small" />
            </button>
          </div>
          <ul className="categories">
            {this.props.categories.map(category => <li key={category}>{category}</li>)}
          </ul>
        </header>
        <div className="widget-container">
          <Spinner isLoading={this.state.loading} className="-light -small" />
          { !this.state.error && widgetType === 'text'
            && <TextChart
              widgetConfig={widgetConfig}
              toggleLoading={loading => this.setState({ loading })}
            />
          }
          { !this.state.error && widgetConfig && widgetType === 'vega'
            && <VegaChart
              data={widgetConfig}
              theme={getChartTheme()}
              toggleLoading={loading => this.setState({ loading })}
              reloadOnResize
            />
          }
          {
            !this.state.error && widgetConfig && widgetType === 'map' && this.state.layers
              && (
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
              )
          }
          { !this.state.error && !this.props.data && !this.props.widgetId
            && <div className="message">
              <div className="no-data">No data</div>
            </div>
          }
          { this.state.error
            && <div className="message">
              <div className="error">Unable to load the widget <span>{this.state.error}</span></div>
            </div>
          }
        </div>
      </div>
    );
  }

}

DashboardCard.propTypes = {
  widgetId: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  isFavourite: PropTypes.bool.isRequired,
  // Redux
  user: PropTypes.object.isRequired,
  // NOTE:
  // The following props will be deprecated once the dashboards
  // have all of their widgets in the API
  name: PropTypes.string,
  data: PropTypes.object // Raw data from the server: { data: { attributes: { ... } } }
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardCard);
