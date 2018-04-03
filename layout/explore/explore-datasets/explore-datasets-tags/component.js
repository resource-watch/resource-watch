import React from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';

// Utils
import { TAGS_BLACKLIST } from 'utils/tags';

// Components
import { Tooltip } from 'wri-api-components';
import Tag from 'components/ui/Tag';
import TagsTooltip from './tooltip';

class ExploreDatasetsTagsComponent extends React.Component {
  static propTypes = {
    vocabulary: PropTypes.object,
    list: PropTypes.array,

    fetchTags: PropTypes.func,
    resetTags: PropTypes.func,
    onTagSelected: PropTypes.func
  };

  state = {
    tagsOpened: false,
    tagsLoading: false
  }

  /**
   * HELPER
   * - getTooltipContainer
  */
  getTooltipContainer() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (document.querySelector('.sidebar-content')) {
        return document.querySelector('.sidebar-content');
      }

      return document.body;
    }

    return null;
  }

  render() {
    const {
      vocabulary,
      list
    } = this.props;

    const { tagsOpened, tagsLoading } = this.state;
    const vTags = (vocabulary.tags || [])
      .sort()
      .filter(t => !TAGS_BLACKLIST.includes(t));

    return (
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
                  key={t}
                  name={`${upperFirst(t.replace('_', ' '))}${i !== vTags.length - 1 ? ', ' : ''}`}
                  className="-clean"
                  onClick={() => {
                    this.setState({ tagsOpened: false });
                    this.props.onTagSelected(t);
                  }}
                />
              ))
          }

          <div
            className="btn-more-container"
          >
            <Tooltip
              overlay={
                <TagsTooltip
                  tags={list}
                  onTagSelected={(t) => {
                    this.setState({ tagsOpened: false });
                    this.props.onTagSelected(t);
                  }}
                />
              }
              visible={tagsOpened}
              overlayClassName="c-rc-tooltip"
              placement="bottomRight"
              trigger="click"
              getTooltipContainer={this.getTooltipContainer}
              monitorWindowResize
              destroyTooltipOnHide
              onVisibleChange={(visible) => {
                if (visible) {
                  this.setState({ tagsLoading: true });

                  this.props.fetchTags(vocabulary.tags)
                    .then(() => {
                      this.setState({ tagsOpened: true, tagsLoading: false });
                    })
                    .catch(() => {
                      this.setState({ tagsLoading: false });
                    });
                } else {
                  this.props.resetTags();
                  this.setState({ tagsOpened: false, tagsLoading: false });
                }
              }}
            >
              <button>
                {tagsLoading && 'loading...'}
                {!tagsLoading && !tagsOpened && 'more...'}
                {!tagsLoading && tagsOpened && 'less...'}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default ExploreDatasetsTagsComponent;
