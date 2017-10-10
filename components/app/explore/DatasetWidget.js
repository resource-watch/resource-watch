import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import classnames from 'classnames';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';
import { Link } from 'routes';
import { toggleLayerGroup } from 'redactions/explore';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Button from 'components/ui/Button';
import Icon from 'components/widgets/editor/ui/Icon';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import DatasetLayerChart from 'components/app/explore/DatasetLayerChart';
import DatasetPlaceholderChart from 'components/app/explore/DatasetPlaceholderChart';
import DatasetTagsTooltip from 'components/app/explore/DatasetTagsTooltip';

// Utils
import { findTagInSelectorTree } from 'utils/explore/TreeUtil';

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
   * Add or remove a layer group from the map
   */
  triggerToggleLayerGroup() {
    const datasetID = this.props.dataset.id;
    const addLayerGroup = !this.props.isLayerGroupAdded(datasetID);
    this.props.toggleLayerGroup(datasetID, addLayerGroup);
  }

  @Autobind
  handleTagsClick(event) {
    const { dataset, topicsTree } = this.props;
    const vocabulary = dataset.attributes.vocabulary && dataset.attributes.vocabulary[0];
    const tags = vocabulary.attributes.tags;
    const filteredTags = tags.filter(tag => findTagInSelectorTree(topicsTree, tag));

    const position = DatasetWidget.getClickPosition(event);
    this.props.toggleTooltip(true, {
      follow: false,
      position,
      children: DatasetTagsTooltip,
      childrenProps: {
        toggleTooltip: this.props.toggleTooltip,
        onTagClick: this.handleTagClick,
        tags: filteredTags
      }
    });
  }

  @Autobind
  handleTagClick(event) {
    const tagName = event.target.textContent;
    this.props.onTagSelected(tagName);
  }

  render() {
    const { widget, layer, mode } = this.props;
    const dataset = this.props.dataset.attributes;
    const metadata = dataset.metadata && dataset.metadata[0];
    const vocabulary = dataset.vocabulary && dataset.vocabulary[0];
    const { showActions } = this.props;
    const gridMode = (mode === 'grid');
    const element = this.getWidgetOrLayer();

    return (
      <div className={`c-dataset-list-item -${mode}`}>

        {/* If it has widget we want to renderize the default widget one */}
        {widget && gridMode &&
          <Link route={'explore_detail'} params={{ id: this.props.dataset.id }}>
            <a>
              <DatasetWidgetChart widget={element} mode="thumbnail" />
            </a>
          </Link>
        }

        {/* If it doesn't have widget but has layer we want to renderize the default layer one */}
        {!widget && layer && gridMode &&
          <Link route={'explore_detail'} params={{ id: this.props.dataset.id }}>
            <a>
              <DatasetLayerChart layer={element} />
            </a>
          </Link>
        }

        {!widget && !layer && gridMode &&
          <Link route={'explore_detail'} params={{ id: this.props.dataset.id }}>
            <a>
              <DatasetPlaceholderChart />
            </a>
          </Link>
        }

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
              {vocabulary &&
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

  // Callbacks
  onTagSelected: PropTypes.func,

  // STORE
  // Topics tree used in the Explore selector
  topicsTree: PropTypes.array.isRequired,
  // Return whether a layer group is already added to the map
  isLayerGroupAdded: PropTypes.func.isRequired,
  // Add or remove a layer group from the map
  toggleLayerGroup: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired
};

const mapStateToProps = ({ explore }) => ({
  isLayerGroupAdded: dataset => !!explore.layers.find(l => l.dataset === dataset),
  topicsTree: explore.topicsTree
});

const mapDispatchToProps = dispatch => ({
  toggleLayerGroup: (dataset, addLayer) => dispatch(toggleLayerGroup(dataset, addLayer)),
  toggleTooltip: (opened, opts) => { dispatch(toggleTooltip(opened, opts)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(DatasetWidget);
