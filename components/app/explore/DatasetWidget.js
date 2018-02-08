import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import classnames from 'classnames';

// Redux
import { connect } from 'react-redux';
import { Link } from 'routes';
import { toggleLayerGroup } from 'redactions/explore';
import { toggleFavourite } from 'redactions/user';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import DatasetLayerChart from 'components/app/explore/DatasetLayerChart';
import DatasetPlaceholderChart from 'components/app/explore/DatasetPlaceholderChart';
import DatasetTagsTooltip from 'components/app/explore/DatasetTagsTooltip';
import Spinner from 'components/ui/Spinner';
import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import CollectionsPanel from 'components/collections-panel';

// Services
import GraphService from 'services/GraphService';
import UserService from 'services/UserService';

// Utils
import { TAGS_BLACKLIST } from 'utils/graph/TagsUtil';
import { logEvent } from 'utils/analytics';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

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
      '-compressed': true,
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

  handleTagsClick = (event) => {
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

  handleTagClick = (event) => {
    const tag = { id: event.target.getAttribute('id'),
      type: event.target.getAttribute('data-type') };
    this.props.onTagSelected(tag);
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
        <DatasetWidgetChart widget={element} mode="thumbnail" />
      );
    } else if (layer || isWidgetMap) {
      return (
        <DatasetLayerChart layer={element} />
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
    const { mode, showActions, user, showFavorite } = this.props;
    const { inferredTags, loading } = this.state;
    const dataset = { ...this.props.dataset.attributes, id: this.props.dataset.id };
    const metadata = dataset.metadata && dataset.metadata[0];
    const isInACollection = belongsToACollection(user, dataset);
    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });
    const starIconClass = classnames({
      '-small': true,
      '-filled': isInACollection,
      '-empty': !isInACollection
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
                <Tooltip
                  overlay={<CollectionsPanel
                    resource={dataset}
                    resourceType="dataset"
                  />}
                  overlayClassName="c-rc-tooltip"
                  overlayStyle={{
                    color: '#fff'
                  }}
                  placement="bottom"
                  trigger="click"
                >
                  <button
                    className="c-btn favourite-button"
                    tabIndex={-1}
                  >
                    <Icon
                      name={starIconName}
                      className={starIconClass}
                    />
                  </button>
                </Tooltip>
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
            {showActions &&
              <div className="actions">
                <Link route="explore_detail" params={{ id: this.props.dataset.id }}>
                  <a className="c-button -secondary -compressed">
                    More info
                  </a>
                </Link>
                {/* Add to Map Button */}
                {this.getButton()}
              </div>
            }
          </MediaQuery>
        </div>
      </div>
    );
  }
}

DatasetWidget.propTypes = {
  // STATE
  user: PropTypes.object.isRequired,
  dataset: PropTypes.object,
  widget: PropTypes.object,
  layer: PropTypes.object,
  mode: PropTypes.string,
  showActions: PropTypes.bool,
  showFavorite: PropTypes.bool,

  // Callbacks
  onTagSelected: PropTypes.func,

  // STORE
  // Return whether a layer group is already added to the map
  isLayerGroupAdded: PropTypes.func.isRequired,
  // Add or remove a layer group from the map
  toggleLayerGroup: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isLayerGroupAdded: dataset => !!state.explore.layers.find(l => l.dataset === dataset),
  user: state.user
});

const mapDispatchToProps = {
  toggleLayerGroup,
  toggleTooltip,
  toggleFavourite
};

export default connect(mapStateToProps, mapDispatchToProps)(DatasetWidget);
