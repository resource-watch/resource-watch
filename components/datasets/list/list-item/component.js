import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import upperFirst from 'lodash/upperFirst';

// Redux
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';
import Tag from 'components/ui/Tag';
import LoginRequired from 'components/ui/login-required';

import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import CollectionsPanel from 'components/collections-panel';

// Utils
import { TAGS_BLACKLIST } from 'utils/graph/TagsUtil';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Dataset Card Components
import WidgetChart from './widget-chart';
import LayerChart from './layer-chart';
import PlaceholderChart from './placeholder-chart';
import TagsTooltip from './tags-tooltip';

class DatasetListItem extends React.Component {
  static propTypes = {
    // STATE
    dataset: PropTypes.object,
    widget: PropTypes.object,
    layer: PropTypes.object,
    metadata: PropTypes.object,
    vocabulary: PropTypes.object,
    tags: PropTypes.array,
    mode: PropTypes.string,
    user: PropTypes.object,
    actions: PropTypes.object
  };

  state = {
    tagsOpened: false
  }

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
      dataset, metadata, vocabulary, mode, user, actions, tags
    } = this.props;

    const { tagsOpened } = this.state;
    const vTags = vocabulary.tags
      .sort()
      .filter(t => !TAGS_BLACKLIST.includes(t))


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
        {/* CHART */}
        {this.renderChart()}

        {/* INFO */}
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
                    placement="bottomLeft"
                    trigger="click"
                    getTooltipContainer={() => typeof document !== 'undefined' && document.querySelector('.sidebar-content')}
                    monitorWindowResize
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
              </h4>
            </div>

            {/* Source */}
            <div className="metadata-container">
              {metadata && metadata.source &&
                <p>Source: {metadata.source}</p>
              }
            </div>

            {/* Tags */}
            <div className="tags-container">
              <div
                className="c-tag-list -inline"
              >
                {vTags &&
                  vTags
                    .sort()
                    .filter(t => !TAGS_BLACKLIST.includes(t))
                    .map((t, i) => (
                      <Tag
                        name={`${upperFirst(t.replace('_', ' '))}${i !== vTags.length - 1 ? ', ' : ''}`}
                        className="-clean"
                        onClick={() => console.info(t)}
                      />
                    ))
                }

                <div
                  className="btn-more-container"
                >
                  <Tooltip
                    overlay={
                      <TagsTooltip
                        tags={tags}
                      />
                    }
                    visible={tagsOpened}
                    overlayClassName="c-rc-tooltip"
                    placement="top"
                    trigger="click"
                    getTooltipContainer={() => typeof document !== 'undefined' && document.querySelector('.sidebar-content')}
                    monitorWindowResize
                    destroyTooltipOnHide
                    onVisibleChange={(visible) => {
                      if (visible) {
                        this.props.fetchTags(vocabulary.tags)
                          .then(() => {
                            this.setState({ tagsOpened: true });
                          });
                      } else {
                        this.props.resetTags();
                        this.setState({ tagsOpened: false });
                      }
                    }}
                  >
                    <button>
                      more...
                    </button>
                  </Tooltip>
                </div>

                {/* <Tooltip
                  overlay={
                    <TagsTooltip
                      tags={tags}
                    />
                  }
                  visible={this.state.tooltip}
                  overlayClassName="c-rc-tooltip -default"
                  placement="top"
                  trigger="click"
                  getTooltipContainer={() => typeof document !== 'undefined' && document.querySelector('.sidebar-content')}
                  monitorWindowResize
                  destroyTooltipOnHide
                  onVisibleChange={(visible) => {
                    if (visible) {
                      this.props.fetchTags(vocabulary.tags)
                        .then(() => {
                          this.setState({ tooltip: true });
                        });
                    } else {
                      this.props.resetTags();
                      this.setState({ tooltip: false });
                    }
                  }}
                >
                  <Tag
                    name="more"
                    className="-secondary"
                  />
                </Tooltip> */}
              </div>
            </div>
          </div>
          {!!actions &&
            React.cloneElement(
              actions,
              { ...this.props }
            )
          }
        </div>
      </div>
    );
  }
}

export default DatasetListItem;
