import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import classnames from 'classnames';

// Redux
import { Link } from 'routes';

// Components
import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';

import Spinner from 'components/ui/Spinner';
import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import CollectionsPanel from 'components/collections-panel';
import LoginRequired from 'components/ui/login-required';

// Services
// import GraphService from 'services/GraphService';

// Utils
import { TAGS_BLACKLIST } from 'utils/graph/TagsUtil';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Dataset Card Components
import WidgetChart from './widget-chart';
import LayerChart from './layer-chart';
import PlaceholderChart from './placeholder-chart';

class DatasetListItem extends React.Component {
  componentDidMount() {
    // this.loadInferredTags();
  }

  /**
  * Load inferred tags
  */
  // loadInferredTags() {
  //   const { dataset } = this.props;
  //   const vocabulary = dataset.attributes.vocabulary && dataset.attributes.vocabulary.length > 0 &&
  //     dataset.attributes.vocabulary[0];
  //   const tags = vocabulary && vocabulary.attributes && vocabulary.attributes.tags;
  //
  //   if (tags && tags.length > 0) {
  //     this.graphService.getInferredTags(tags)
  //       .then((response) => {
  //         this.setState({
  //           inferredTags: response.filter(tag => tag.labels
  //             .find(type => (type === 'TOPIC') && !TAGS_BLACKLIST.includes(tag.id)))
  //         });
  //       })
  //       .catch((err) => {
  //         this.setState({ inferredTags: [] });
  //         console.error('Error loading inferred tags', err);
  //       });
  //   }
  // }

  // /**
  //  * Add or remove a layer group from the map
  //  */
  // triggerToggleLayerGroup() {
  //   const datasetID = this.props.dataset.id;
  //   const addLayerGroup = !this.props.isLayerGroupAdded(datasetID);
  //   this.props.toggleLayerGroup(datasetID, addLayerGroup);
  //
  //   if (addLayerGroup) {
  //     logEvent('Explore', 'Add dataset to map', this.props.dataset.attributes.name);
  //   }
  // }

  // handleTagsClick = (event) => {
  //   const { inferredTags } = this.state;
  //
  //   const position = DatasetWidget.getClickPosition(event);
  //   this.props.toggleTooltip(true, {
  //     follow: false,
  //     position,
  //     children: DatasetTagsTooltip,
  //     childrenProps: {
  //       toggleTooltip: this.props.toggleTooltip,
  //       onTagClick: this.handleTagClick,
  //       tags: inferredTags
  //     }
  //   });
  // }

  // handleTagClick = (event) => {
  //   const tag = { id: event.target.getAttribute('id'),
  //     type: event.target.getAttribute('data-type') };
  //   this.props.onTagSelected(tag);
  // }

  /**
   * HELPER
   * return chart
  */
  renderChart = () => {
    const {
      dataset, widget, layer, mode
    } = this.props;

    const isWidgetMap = widget && widget.widgetConfig.type === 'map';

    if (mode !== 'grid') return null;

    if (widget && !isWidgetMap) {
      return (
        <WidgetChart widget={widget} mode="thumbnail" />
      );
    } else if (layer || isWidgetMap) {
      return (
        <LayerChart layer={layer} />
      );
    }

    return (
      <Link route="explore_detail" params={{ id: dataset.id }}>
        <a>
          <PlaceholderChart />
        </a>
      </Link>
    );
  }


  render() {
    const {
      dataset, widget, layer, metadata, mode, user
    } = this.props;

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

        {/* <Spinner
          isLoading={loading}
          className="-small -light -tiny"
        /> */}

        {this.renderChart()}

        <div className="info">
          <div className="detail">
            {/* Title */}
            <div className="title-container">
              <h4>
                <Link
                  route="explore_detail"
                  params={{ id: this.props.dataset.id }}
                >
                  <a>
                    {(metadata && metadata.info && metadata.info.name) || dataset.name}
                  </a>
                </Link>
              </h4>

              {/* Favorite dataset icon */}
              <LoginRequired text="Log in or sign up to save items in favorites">
                <Tooltip
                  overlay={
                    <CollectionsPanel
                      resource={dataset}
                      resourceType="dataset"
                    />
                  }
                  overlayClassName="c-rc-tooltip"
                  overlayStyle={{
                    color: '#fff'
                  }}
                  placement="bottomLeft"
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
              </LoginRequired>
            </div>

            {/* Source */}
            {metadata && metadata.source &&
              <p>Source: {metadata.source}</p>
            }
          </div>
        </div>
      </div>
    );
  }
}

DatasetListItem.propTypes = {
  // STATE
  user: PropTypes.object.isRequired,
  dataset: PropTypes.object,
  widget: PropTypes.object,
  layer: PropTypes.object,
  mode: PropTypes.string
};

export default DatasetListItem;
