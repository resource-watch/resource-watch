import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import classnames from 'classnames';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';
import { Link } from 'routes';
import { toggleLayerGroup, addFavoriteDataset, removeFavoriteDataset } from 'redactions/explore';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Button from 'components/ui/Button';
import Icon from 'components/widgets/editor/ui/Icon';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import DatasetLayerChart from 'components/app/explore/DatasetLayerChart';
import DatasetPlaceholderChart from 'components/app/explore/DatasetPlaceholderChart';
import DatasetTagsTooltip from 'components/app/explore/DatasetTagsTooltip';
import Spinner from 'components/ui/Spinner';

// Services
import GraphService from 'services/GraphService';
import UserService from 'services/UserService';

// Utils
import { TAGS_BLACKLIST } from 'utils/graph/TagsUtil';
import { logEvent } from 'utils/analytics';

class DatasetWidget extends React.Component {
  /**
   * Shorten text to 70 character maximum and add
   * an ellipsis at the end
   * @static
   * @param {string} text - Text to shorten
   * @returns {string}
   */
  static shortenText(text) {
    let res = text;
    if (typeof text === 'string' && text.length > 70) {
      res = res.replace(/^(.{70}[^\s]*).*/, '$1');
      return `${text}...`;
    }
    return res;
  }

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

  constructor(props) {
    super(props);

    this.state = {
      inferredTags: [],
      loading: false
    };

    // Services
    this.graphService = new GraphService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadInferredTags();
  }

  /**
   * Return the button to show the layer on the map
   * @returns {HTMLElement}
   */
  getButton() {
    const isActive = this.props.isLayerGroupAdded(this.props.dataset.id);
    const hasLayer = this.props.layer;

    const classes = classnames({
      '-secondary': !isActive,
      '-primary': isActive,
      '-fullwidth': true,
      '-disable': !hasLayer
    });

    return (
      <Button
        properties={{ className: classes }}
        disabled={!hasLayer}
        onClick={() => this.triggerToggleLayerGroup()}
      >
        {isActive ? 'Active' : 'Add to map'}
      </Button>
    );
  }

  /**
   * Get the data of the widget or layer depending on the
   * dataset
   * @returns {object}
   */
  getWidgetOrLayer() {
    if (this.props.widget) {
      return {
        ...this.props.widget.attributes,
        id: this.props.widget.id
      };
    }

    if (this.props.layer) {
      return {
        ...this.props.layer.attributes,
        id: this.props.layer.id
      };
    }

    return null;
  }

  /**
  * Load inferred tags
  */
  loadInferredTags() {
    const { dataset } = this.props;
    const vocabulary = dataset.attributes.vocabulary && dataset.attributes.vocabulary.length > 0 &&
      dataset.attributes.vocabulary[0];
    const tags = vocabulary && vocabulary.attributes && vocabulary.attributes.tags;

    if (tags && tags.length > 0) {
      this.graphService.getInferredTags(tags)
        .then((response) => {
          this.setState({
            inferredTags: response.filter(tag => tag.labels
              .find(type => (type === 'TOPIC') && !TAGS_BLACKLIST.includes(tag.id)))
          });
        })
        .catch((err) => {
          this.setState({ inferredTags: [] });
          console.error('Error loading inferred tags', err);
        });
    }
  }

  /**
   * Add or remove a layer group from the map
   */
  triggerToggleLayerGroup() {
    const datasetID = this.props.dataset.id;
    const addLayerGroup = !this.props.isLayerGroupAdded(datasetID);
    this.props.toggleLayerGroup(datasetID, addLayerGroup);

    if (addLayerGroup) {
      logEvent('Explore', 'Add dataset to map', this.props.dataset.attributes.name);
    }
  }

  @Autobind
  handleTagsClick(event) {
    const { inferredTags } = this.state;

    const position = DatasetWidget.getClickPosition(event);
    this.props.toggleTooltip(true, {
      follow: false,
      position,
      children: DatasetTagsTooltip,
      childrenProps: {
        toggleTooltip: this.props.toggleTooltip,
        onTagClick: this.handleTagClick,
        tags: inferredTags
      }
    });
  }

  @Autobind
  handleTagClick(event) {
    const tag = { id: event.target.getAttribute('id'),
      type: event.target.getAttribute('data-type') };
    this.props.onTagSelected(tag);
  }

  @Autobind
  handleFavoriteButtonClick() {
    const { favorite, dataset, user } = this.props;
    this.setState({ loading: true });

    if (!favorite) {
      this.userService.createFavouriteDataset(dataset.id, user.token)
        .then((response) => {
          this.props.addFavoriteDataset(response.data, user.token);
          this.setState({ loading: false });
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.error(err);
        });
    } else {
      this.userService.deleteFavourite(favorite.id, user.token)
        .then((response) => {
          this.props.onFavoriteRemoved(favorite);
          this.props.removeFavoriteDataset(response.data);
          this.setState({ loading: false });
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.error(err);
        });
    }
  }

  /**
   * HELPER
   * return chart
  */
  renderChart = () => {
    const { widget, layer, mode } = this.props;
    const element = this.getWidgetOrLayer();
    const isWidgetMap = widget && widget.attributes.widgetConfig.type === 'map';

    if (mode !== 'grid') return null;

    if (widget && !isWidgetMap) {
      return (
        <Link route={'explore_detail'} params={{ id: this.props.dataset.id }}>
          <a>
            <DatasetWidgetChart widget={element} mode="thumbnail" />
          </a>
        </Link>
      );
    } else if (layer || isWidgetMap) {
      return (
        <Link route={'explore_detail'} params={{ id: this.props.dataset.id }}>
          <a>
            <DatasetLayerChart layer={element} />
          </a>
        </Link>
      );
    }

    return (
      <Link route={'explore_detail'} params={{ id: this.props.dataset.id }}>
        <a>
          <DatasetPlaceholderChart />
        </a>
      </Link>
    );
  }


  render() {
    const { mode, showActions, favorite, user, showFavorite } = this.props;
    const { inferredTags, loading } = this.state;
    const dataset = this.props.dataset.attributes;
    const metadata = dataset.metadata && dataset.metadata[0];
    const starIconName = favorite ? 'icon-star-full' : 'icon-star-empty';

    const starIconClass = classnames({
      '-small': true,
      '-filled': favorite,
      '-empty': !favorite
    });

    return (
      <div className={`c-dataset-list-item -${mode}`}>
        <Spinner isLoading={loading} className="-small -light" />

        {this.renderChart()}

        <div className="info">
          <div className="detail">
            {/* Title */}
            <div className="title-container">
              <h4>
                <Link
                  route={'explore_detail'}
                  params={{ id: this.props.dataset.id }}
                >
                  <a>{metadata && metadata.attributes.info ?
                    metadata.attributes.info.name : dataset.name}</a>
                </Link>
              </h4>
              {/* Dataset tags link */}
              {inferredTags && inferredTags.length > 0 &&
                <div
                  className="tags-button"
                  onClick={this.handleTagsClick}
                  title="tags"
                  role="button"
                  tabIndex={-1}
                >
                  <Icon
                    name="icon-item-category"
                    className="-small"
                  />
                </div>
              }
              {/* Favorite dataset icon */}
              {user && user.id && showFavorite &&
                <div
                  className="favorite-button"
                  onClick={this.handleFavoriteButtonClick}
                  title="Favorite dataset"
                  role="button"
                  tabIndex={-1}
                >
                  <Icon
                    name={starIconName}
                    className={starIconClass}
                  />
                </div>
              }
            </div>

            {/* Description */}
            {dataset.metadata && (dataset.metadata.length > 0)
              && dataset.metadata[0].info
              && dataset.metadata[0].attributes.info.functions
              && (
                <p>
                  {DatasetWidget.shortenText(dataset.metadata[0].attributes.info.functions)}
                </p>
              )
            }

            {/* Source */}
            {dataset.metadata && (dataset.metadata.length > 0)
              && dataset.metadata[0].attributes.source
              && <p>Source: {dataset.metadata[0].attributes.source}</p>
            }
          </div>
          <MediaQuery minDeviceWidth={720} values={{ deviceWidth: 720 }}>
            <div className="actions">
              {/* Layer Button */}
              {showActions && this.getButton()}
            </div>
          </MediaQuery>
        </div>
      </div>
    );
  }
}

DatasetWidget.propTypes = {
  // STATE
  dataset: PropTypes.object,
  widget: PropTypes.object,
  layer: PropTypes.object,
  mode: PropTypes.string,
  showActions: PropTypes.bool,
  showFavorite: PropTypes.bool,
  favorite: PropTypes.object,

  // Callbacks
  onTagSelected: PropTypes.func,
  onFavoriteRemoved: PropTypes.func,

  // STORE
  // Return whether a layer group is already added to the map
  isLayerGroupAdded: PropTypes.func.isRequired,
  // Add or remove a layer group from the map
  toggleLayerGroup: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  removeFavoriteDataset: PropTypes.func.isRequired,
  addFavoriteDataset: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  isLayerGroupAdded: dataset => !!state.explore.layers.find(l => l.dataset === dataset),
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  toggleLayerGroup: (dataset, addLayer) => dispatch(toggleLayerGroup(dataset, addLayer)),
  toggleTooltip: (opened, opts) => { dispatch(toggleTooltip(opened, opts)); },
  addFavoriteDataset: (favorite) => { dispatch(addFavoriteDataset(favorite)); },
  removeFavoriteDataset: (favorite) => { dispatch(removeFavoriteDataset(favorite)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(DatasetWidget);
