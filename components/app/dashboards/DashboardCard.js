import React from 'react';
import PropTypes from 'prop-types';
import 'isomorphic-fetch';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Components
import Title from 'components/widgets/editor/ui/Title';
import TextChart from 'components/widgets/charts/TextChart';
import VegaChart from 'components/widgets/charts/VegaChart';
import Map from 'components/widgets/editor/map/Map';
import Legend from 'components/widgets/editor/ui/Legend';
import Spinner from 'components/widgets/editor/ui/Spinner';
import Icon from 'components/widgets/editor/ui/Icon';

// Redux
import { connect } from 'react-redux';

// Utils
import getChartTheme from 'utils/widgets/theme';
import LayerManager from 'components/widgets/editor/helpers/LayerManager';

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
      favourite: this.getFavourite(props)
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
    if (nextProps.favourites !== this.state.favourites) {
      this.setState({
        favourite: this.getFavourite(nextProps)
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
   * If the widget has been favourited, return the "favourite" object,
   * null otherwise
   * @param {any} props
   * @returns {any}
   */
  getFavourite(props) { // eslint-disable-line class-methods-use-this
    return props.favourites.find(f => f.attributes.resourceId === props.widgetId);
  }

  /**
   * Fetch the widget's data and set a few properties in the
   * state once done
   */
  getData() {
    this.setState({ loading: true });

    fetch(`${process.env.WRI_API_URL}/widget/${this.props.widgetId}?&application=${[process.env.APPLICATIONS]}`)
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
      // TODO error message
      .catch(err => this.setState({ error: err.message }));
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

    fetch(`${process.env.WRI_API_URL}/layer/${widgetConfig.layer_id}?&application=${[process.env.APPLICATIONS]}`)
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
    const { favourite } = this.state;
    const { widgetId, user } = this.props;

    this.setState({ loading: true });

    if (favourite) {
      this.userService.deleteFavourite(favourite.id, user.token)
        .then(() => {
          this.setState({
            favourite: null,
            loading: false
          });
        })
        .catch(err => toastr.error('Error', err));
    } else {
      this.userService.createFavouriteWidget(widgetId, user.token)
        .then((res) => {
          this.setState({
            favourite: res.data,
            loading: false
          });
        })
        .catch(err => toastr.error('Error', err));
    }
  }

  render() {
    const { favourite } = this.state;
    const widgetConfig = this.getWidgetConfig();

    // Type of the widget: "vega", "text" or "map"
    const widgetType = (widgetConfig && widgetConfig.type) || 'vega';

    const iconName = favourite ? 'star-full' : 'star-empty';

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
  widgetId: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  // Redux
  user: PropTypes.object.isRequired,
  favourites: PropTypes.array,
  // NOTE:
  // The following props will be deprecated once the dashboards
  // have all of their widgets in the API
  name: PropTypes.string,
  data: PropTypes.object // Raw data from the server: { data: { attributes: { ... } } }
};

const mapStateToProps = state => ({
  user: state.user,
  favourites: state.user.favourites
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardCard);
