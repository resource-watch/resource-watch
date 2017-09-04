import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';

// Layout
import Head from 'components/app/layout/head';

// Components
import Page from 'components/app/layout/Page';
import Icons from 'components/app/layout/icons';
import Spinner from 'components/ui/Spinner';
import Modal from 'components/ui/Modal';
import VegaChart from 'components/widgets/VegaChart';
import Tooltip from 'components/ui/Tooltip';
import Map from 'components/vis/Map';
import Legend from 'components/ui/Legend';

// Services
import WidgetService from 'services/WidgetService';
import LayersService from 'services/LayersService';

// Utils
import ChartTheme from 'utils/widgets/theme';
import LayerManager from 'utils/layers/LayerManager';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';

class EmbedWidget extends Page {
  constructor(props) {
    super(props);

    this.state = {
      widget: null,
      loading: true,
      visualizationLoading: false,
      layer: null,
      layerGroups: [],
      modalOpen: false
    };

    // WidgetService
    this.widgetService = new WidgetService(this.props.url.query.id, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  /**
   * Return the visualization
   * @returns {HTMLElement}
   */
  getVisualization() {
    const { visualizationLoading, layerGroups } = this.state;
    const { widgetConfig } = this.state.widget;

    if (widgetConfig.paramsConfig.visualizationType === 'map') {
      const mapConfig = { zoom: 3, latLng: { lat: 0, lng: 0 } };

      // If the layerGroups are not created yet, we just display a loader
      if (!layerGroups.length) {
        return (
          <Spinner isLoading className="-light" />
        );
      }

      return (
        <div className="visualization">
          <Map
            LayerManager={LayerManager}
            mapConfig={mapConfig}
            layerGroups={layerGroups}
          />

          <Legend
            layerGroups={layerGroups}
            className={{ color: '-dark' }}
            toggleLayerGroupVisibility={
              layerGroup => this.onToggleLayerGroupVisibility(layerGroup)
            }
            setLayerGroupsOrder={() => {}}
            setLayerGroupActiveLayer={() => {}}
            readonly
            expanded={false}
          />
        </div>
      );
    }

    return (
      <div className="visualization">
        <Spinner isLoading={visualizationLoading} className="-light" />
        <VegaChart
          data={widgetConfig}
          theme={ChartTheme()}
          toggleLoading={loading => this.setState({ visualizationLoading: loading })}
          reloadOnResize
        />
      </div>
    );
  }

  /**
   * Load the initial data and sets the state of the component
   */
  loadData() {
    this.setState({ loading: true });

    this.widgetService.fetchData()
      .then(data => data && data.attributes)
      .then((widget) => {
        const { widgetConfig } = widget;

        // Promise to fetch and set the information about the layer in the state
        // If the widget is not a map, this promise is null
        let layerPromise = null;

        // If the widget is a map,  we fetch the information about the
        // layer
        if (widgetConfig.paramsConfig.visualizationType === 'map') {
          const id = widgetConfig.paramsConfig.layer;
          layerPromise = new LayersService().fetchData({ id })
            .then(layer => new Promise(resolve => this.setState({ layer }, resolve)));
        }

        return Promise.all([
          new Promise(resolve => this.setState({ widget }, resolve)),
          layerPromise
        ]);
      })
      .then(() => {
        const { dataset } = this.state.widget;

        // If we just fetched the information of a layer, we create
        // the layerGroups
        let layerGroups = [];
        if (this.state.layer) {
          layerGroups = [{
            dataset,
            visible: true,
            layers: [{
              active: true,
              ...this.state.layer
            }]
          }];
        }

        this.setState({ layerGroups });
      })
      // TODO: handle the error in the UI
      .catch(err => toastr.error('Error', err))
      .then(() => this.setState({ loading: false }));
  }

  @Autobind
  triggerToggleLoading(loading) {
    this.setState({ loading });
  }

  /**
   * Event handler executed when the user toggles the
   * visibility of a layer group
   * @param {LayerGroup} layerGroup - Layer group to toggle
   */
  onToggleLayerGroupVisibility(layerGroup) {
    const layerGroups = this.state.layerGroups.map((l) => {
      if (l.dataset !== layerGroup.dataset) return l;
      return Object.assign({}, l, { visible: !layerGroup.visible });
    });

    this.setState({ layerGroups: [...layerGroups] });
  }

  render() {
    const { widget, loading } = this.state;

    return (
      <div className="c-embed-widget">
        <Head
          title={(widget && widget.name) || 'Loading...'}
          description={(widget && widget.name) || 'Loading..'}
        />
        <Tooltip />
        <Spinner
          isLoading={loading}
          className="-light"
        />

        {widget &&
          <div>
            {this.getVisualization()}
            <div className="info">
              <div className="widget-title">
                <h2>
                  <Link
                    route="explore_detail"
                    params={{ id: widget.dataset }}
                  >
                    <a>{widget.name}</a>
                  </Link>
                </h2>
              </div>
              <div className="widget-description">
                {widget.description}
              </div>
            </div>
          </div>
        }

        <Modal
          open={this.state.modalOpen}
          options={this.props.modal.options}
          loading={this.props.modal.loading}
          toggleModal={this.props.toggleModal}
          setModalOptions={this.props.setModalOptions}
        />

        <Icons />
      </div>
    );
  }
}

EmbedWidget.propTypes = {
  url: PropTypes.object.isRequired,

  // Store
  modal: PropTypes.object,
  toggleModal: PropTypes.func,
  setModalOptions: PropTypes.func
};

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (...params) => dispatch(toggleModal(...params)),
  setModalOptions: (...params) => dispatch(setModalOptions(...params))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedWidget);
