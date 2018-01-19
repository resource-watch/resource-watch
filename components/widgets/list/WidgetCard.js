import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Title from 'components/widgets/editor/ui/Title';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import DatasetLayerChart from 'components/app/explore/DatasetLayerChart';
import EmbedMyWidgetModal from 'components/modal/EmbedMyWidgetModal';
import WidgetActionsTooltip from 'components/widgets/list/WidgetActionsTooltip';
import AddWidgetToCollectionTooltip from 'components/widgets/list/AddWidgetToCollectionTooltip';
import Icon from 'components/widgets/editor/ui/Icon';
import Map from 'components/ui/map/Map';
import Legend from 'components/ui/Legend';
import Spinner from 'components/ui/Spinner';
import TextChart from 'components/widgets/charts/TextChart';

// Services
import WidgetService from 'services/WidgetService';
import UserService from 'services/UserService';
import LayersService from 'services/LayersService';

// Utils
import LayerManager from 'components/widgets/editor/helpers/LayerManager';

class WidgetCard extends React.Component {
  /**
   * Return the position of the click within the page taking
   * into account the scroll (relative to the page, not the
   * viewport )
   * @static
   * @param {MouseEvent} e Event
   * @returns {{ x: number, y: number }}
   */
  static getClickPosition(e) {
    return {
      x: window.scrollX + e.clientX,
      y: window.scrollY + e.clientY
    };
  }

  /**
   * HELPERS
   * - getDescription
  */
  static getDescription(_text) {
    let text = _text;
    if (typeof text === 'string' && text.length > 70) {
      text = text.replace(/^(.{70}[^\s]*).*/, '$1');
      return `${text}...`;
    }
    return text;
  }

  /**
   * Return whether the widget represents a map
   * @static
   * @param {any} widget
   * @returns {boolean}
   */
  static isMapWidget(widget) {
    return !!(widget
      // Some widgets have not been created with the widget editor
      // so the paramsConfig attribute doesn't exist
      && (
        (
          widget.attributes.widgetConfig.paramsConfig
          && widget.attributes.widgetConfig.paramsConfig.layer
        )
        || (
          // Case of a widget created outside of the widget editor
          widget.attributes.widgetConfig.type
          && widget.attributes.widgetConfig.type === 'map'
        )
      )
    );
  }

  /**
   * return whether the widget is an embedded page
   * @static
   * @param {any} widget
   * @returns {boolean}
   */
  static isEmbedWidget(widget) {
    return !!(widget
      // Some widgets have not been created with the widget editor
      // so the paramsConfig attribute doesn't exist
      && (
        (
          widget.attributes.widgetConfig.paramsConfig
          && widget.attributes.widgetConfig.paramsConfig.visualizationType === 'embed'
        )
        || (
          // Case of a widget created outside of the widget editor
          widget.attributes.widgetConfig.type
          && widget.attributes.widgetConfig.type === 'embed'
        )
      )
    );
  }

  /**
   * Return whether the widget represents a text
   * @static
   * @param {any} widget
   * @returns {boolean}
   */
  static isTextualWidget(widget) {
    return !!(widget
      // The widgets that are created through the widget editor
      // don't have any "type" attribute
      && widget.attributes.widgetConfig.type
      && widget.attributes.widgetConfig.type === 'text'
    );
  }

  constructor(props) {
    super(props);

    // Services
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
    this.widgetService = new WidgetService(null, {
      apiURL: process.env.WRI_API_URL
    });
    this.layersService = new LayersService();

    this.state = {
      loading: false,
      error: null,
      layer: null, // Info about the eventual layer
      layerGroups: []
    };

    // ---------------------- Bindings --------------------------
    this.handleRemoveWidget = this.handleRemoveWidget.bind(this);
    this.handleEmbed = this.handleEmbed.bind(this);
    this.handleAddToDashboard = this.handleAddToDashboard.bind(this);
    this.handleEditWidget = this.handleEditWidget.bind(this);
    this.handleGoToDataset = this.handleGoToDataset.bind(this);
    this.handleDownloadPDF = this.handleDownloadPDF.bind(this);
    this.handleWidgetActionsClick = this.handleWidgetActionsClick.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleAddToWidgetCollection = this.handleAddToWidgetCollection.bind(this);
    this.handleUpdateWidgetToCollections = this.handleUpdateWidgetToCollections.bind(this);
    // ----------------------------------------------------------
  }

  componentDidMount() {
    if (WidgetCard.isMapWidget(this.props.widget)) {
      const layer = (this.props.widget.attributes.widgetConfig.paramsConfig
        && this.props.widget.attributes.widgetConfig.paramsConfig.layer)
        || this.props.widget.attributes.widgetConfig.layer_id;

      this.fetchLayer(layer);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.widget, this.props.widget)
      && WidgetCard.isMapWidget(nextProps.widget)) {
      const layer = (nextProps.widget.attributes.widgetConfig.paramsConfig
        && nextProps.widget.attributes.widgetConfig.paramsConfig.layer)
        || nextProps.widget.attributes.widgetConfig.layer_id;

      this.fetchLayer(layer);
    }
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

  /**
   * Return the widget
   * @returns {HTMLElement}
   */
  getWidget() {
    if (!this.props.widget) return null;

    if (this.state.loading || (!this.state.layer && WidgetCard.isMapWidget(this.props.widget))) {
      return (
        <div className={classnames('c-widget-chart', `-${this.props.mode}`, '-map')}>
          <Spinner className="-light" isLoading />
        </div>
      );
    }

    if (this.state.error) {
      toastr.error('Error', this.state.error);
      // TODO: Correctly show the UI
      return null;
    }

    // If the widget is an embedded page, we render a
    // different component
    if (WidgetCard.isEmbedWidget(this.props.widget)) {
      if (this.props.mode === 'thumbnail') {
        return (
          <div className="c-widget-chart -thumbnail">
            <div className="c-chart -no-preview">
              <span>No preview</span>
            </div>
          </div>
        );
      }

      return (
        <div className="c-widget-chart -embed">
          <iframe
            title={this.props.widget.attributes.name}
            src={this.props.widget.attributes.widgetConfig.paramsConfig.embed.src}
            frameBorder="0"
          />
        </div>
      );
    }

    // If the widget is a map, we render the correct component
    if (WidgetCard.isMapWidget(this.props.widget)) {
      // We render the thumbnail of a map
      if (this.props.mode === 'thumbnail') {
        return (
          <DatasetLayerChart layer={this.state.layer} />
        );
      }

      // We render a full map
      return (
        <div className="c-widget-chart -map">
          <Map
            LayerManager={LayerManager}
            mapConfig={{}}
            layerGroups={this.state.layerGroups}
          />
          <Legend
            layerGroups={this.state.layerGroups}
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
      );
    }

    // If the widget is a textual one, it's rendered differently
    if (WidgetCard.isTextualWidget(this.props.widget)) {
      return (
        <div className={classnames('c-widget-chart', `-${this.props.mode}`)}>
          <TextChart widgetConfig={this.props.widget.attributes.widgetConfig} />
        </div>
      );
    }

    // We render a Vega chart
    return (
      <DatasetWidgetChart
        widget={this.props.widget.attributes}
        mode={this.props.mode}
      />
    );
  }


  /**
   * Fetch the information about the layer and store it in the state
   * @param {string} layerId
   */
  fetchLayer(layerId) {
    this.setState({ loading: true, error: null });
    this.layersService.fetchData({ id: layerId })
      .then((layer) => {
        this.setState({
          layer,
          layerGroups: [{
            dataset: layer.dataset,
            visible: true,
            layers: [{
              active: true,
              ...layer
            }]
          }]
        });
      })
      .catch(err => this.setState({ error: err.message }))
      .then(() => this.setState({ loading: false }));
  }

  /*
  * UI EVENTS
  *
  * - handleRemoveWidget
  * - handleClick
  */
  handleRemoveWidget() {
    const widgetId = this.props.widget.id;
    const widgetName = this.props.widget.attributes.name;
    // eslint-disable-next-line no-alert
    if (confirm(`Are you sure you want to remove the widget: ${widgetName}?`)) {
      this.widgetService.removeUserWidget(widgetId, this.props.user.token)
        .then(() => this.props.onWidgetRemove())
        .catch(err => toastr.error('Error', err));
    }
  }

  handleEmbed() {
    const options = {
      children: EmbedMyWidgetModal,
      childrenProps: {
        widget: this.props.widget,
        visualizationType: (this.props.widget.attributes.widgetConfig
          && this.props.widget.attributes.widgetConfig.paramsConfig
          && this.props.widget.attributes.widgetConfig.paramsConfig.visualizationType)
          || 'chart',
        toggleModal: this.props.toggleModal
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  handleAddToDashboard() { // eslint-disable-line class-methods-use-this
    // TO-DO implement this
  }

  handleEditWidget() {
    Router.pushRoute('myrw_detail', { tab: 'widgets', subtab: 'edit', id: this.props.widget.id });
  }

  handleGoToDataset() {
    Router.pushRoute('explore_detail', { id: this.props.widget.attributes.dataset });
  }

  handleDownloadPDF() {
    toastr.info('Widget download', 'The file is being generated...');

    const id = this.props.widget.id;
    const type = this.props.widget.attributes.widgetConfig.type || 'widget';
    const { protocol, hostname, port } = window.location;
    const host = `${protocol}//${hostname}${port !== '' ? `:${port}` : port}`;
    const filename = encodeURIComponent(this.props.widget.attributes.name);

    const link = document.createElement('a');
    link.setAttribute('download', '');
    link.href = `${process.env.CONTROL_TOWER_URL}/v1/webshot/pdf?filename=${filename}&width=790&height=580&url=${host}/embed/${type}/${id}`;

    // link.click() doesn't work on Firefox for some reasons
    // so we have to create an event manually
    const event = new MouseEvent('click');
    link.dispatchEvent(event);
  }

  handleWidgetActionsClick(event) {
    const { widget } = this.props;
    const widgetAtts = widget.attributes;
    const widgetLinks = (widgetAtts.metadata && widgetAtts.metadata.length > 0 &&
      widgetAtts.metadata[0].attributes.info &&
      widgetAtts.metadata[0].attributes.info.widgetLinks) || [];
    const position = WidgetCard.getClickPosition(event);
    this.props.toggleTooltip(true, {
      follow: false,
      position,
      children: WidgetActionsTooltip,
      childrenProps: {
        toggleTooltip: this.props.toggleTooltip,
        onShareEmbed: this.handleEmbed,
        onAddToDashboard: this.handleAddToDashboard,
        onGoToDataset: this.handleGoToDataset,
        onEditWidget: this.handleEditWidget,
        onDownloadPDF: this.handleDownloadPDF,
        widgetLinks
      }
    });
  }

  handleStarClick(event) {
    event.preventDefault();
    const { widget, user } = this.props;
    toastr.confirm(`Are you sure you want to unfavourite the widget ${widget.attributes.name}?`, {
      onOk: () => {
        this.userService.deleteFavourite(widget.favouriteId, user.token)
          .then(() => {
            this.props.onWidgetUnfavourited();
          });
      }
    });
  }

  handleAddToWidgetCollection(event) {
    const { widget, user, widgetCollections, widgetCollectionsOptions } = this.props;
    const position = WidgetCard.getClickPosition(event);
    this.props.toggleTooltip(true, {
      follow: false,
      position,
      children: AddWidgetToCollectionTooltip,
      childrenProps: {
        widget,
        user,
        widgetCollections,
        widgetCollectionsOptions,
        toggleTooltip: this.props.toggleTooltip,
        onUpdateWidgetCollections: this.handleUpdateWidgetToCollections
      }
    });
  }

  handleUpdateWidgetToCollections() {
    this.props.onUpdateWidgetCollections();
  }

  render() {
    const {
      widget,
      showRemove,
      showActions,
      showEmbed,
      showStar,
      showWidgetColllections,
      widgetCollections
    } = this.props;

    const numberOfCollections = widgetCollections && widgetCollections.length
      && widgetCollections[0].tags.length;
    const numberOfCollectionsText = numberOfCollections === 1
      ? '1 collection' : `${numberOfCollections} collections`;

    return (
      <div className={'c-widget-card'}>
        {showWidgetColllections &&
          <div className="widget-collections">
            <button onClick={this.handleAddToWidgetCollection}>
              {numberOfCollectionsText}
            </button>
          </div>
        }

        {/* Actual widget */}
        <div
          tabIndex={-1}
          role="button"
          onClick={() => this.props.onWidgetClick && this.props.onWidgetClick(widget)}
        >
          {this.getWidget()}
        </div>

        <div className="info">
          <div
            className="detail"
            tabIndex={-1}
            role="button"
            onClick={() => this.props.onWidgetClick && this.props.onWidgetClick(widget)}
          >
            {/* Title */}
            <Title className="-default -primary">
              {widget.attributes.name}
            </Title>
            <p>
              {WidgetCard.getDescription(widget.attributes.description)}
            </p>
          </div>

          {(showActions || showRemove || showEmbed) &&
            <div className="actions">
              {showActions &&
                <button
                  className="c-button -secondary widget-actions"
                  onClick={this.handleWidgetActionsClick}
                >
                  Widget actions
                </button>
              }
              {showRemove &&
                <button
                  className="c-button -tertiary"
                  onClick={this.handleRemoveWidget}
                >
                  Delete
                </button>
              }
              {showEmbed &&
                <button
                  className="c-button -tertiary"
                  onClick={this.handleEmbed}
                >
                  Embed
                </button>
              }
            </div>
          }
        </div>

        {showStar &&
          <a
            className="star-icon"
            role="button"
            tabIndex={0}
            onClick={this.handleStarClick}
          >
            <Icon name="icon-star-full" className="c-icon -small" />
          </a>
        }
      </div>
    );
  }
}

WidgetCard.defaultProps = {
  showActions: false,
  showRemove: false,
  showWidgetColllections: false
};

WidgetCard.propTypes = {
  widget: PropTypes.object.isRequired,
  widgetCollections: PropTypes.array,
  widgetCollectionsOptions: PropTypes.array,
  showActions: PropTypes.bool,
  showRemove: PropTypes.bool,
  showEmbed: PropTypes.bool,
  showStar: PropTypes.bool,
  showWidgetColllections: PropTypes.bool,
  mode: PropTypes.oneOf(['thumbnail', 'full']), // How to show the graph
  // Callbacks
  onWidgetClick: PropTypes.func,
  onWidgetRemove: PropTypes.func,
  onWidgetUnfavourited: PropTypes.func,
  onUpdateWidgetCollections: PropTypes.func,
  // Store
  user: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WidgetCard);
