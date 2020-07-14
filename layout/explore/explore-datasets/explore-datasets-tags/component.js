import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import upperFirst from 'lodash/upperFirst';

// Utils
import { TAGS_BLACKLIST } from 'utils/tags';

// Components
import { Tooltip } from 'vizzuality-components';
import Tag from 'components/ui/Tag';
import TagsTooltip from './tooltip';
import { getTooltipContainer } from 'utils/tooltip';


class ExploreDatasetsTagsComponent extends React.Component {
  static propTypes = {
    vocabulary: PropTypes.object,
    list: PropTypes.array,
    options: PropTypes.object,

    // Actions
    fetchDatasets: PropTypes.func,
    setDatasetsPage: PropTypes.func,
    fetchTags: PropTypes.func,
    resetTags: PropTypes.func,
    toggleFiltersSelected: PropTypes.func
  };

  state = {
    tagsOpened: false,
    tagsLoading: false
  }

  onTagSelected = (tag) => {
    const options = Object.keys(this.props.options).map(o => this.props.options[o]);

    const tab = options.find(o => o.type === tag.labels[1]) || {};

    this.props.toggleFiltersSelected({
      tab: tab.value || 'custom',
      tag
    });
    this.fetchDatasets(1);
  }

  onVisibleChange = (visible) => {
    const { vocabulary } = this.props;

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
  }

  /**
   * HELPER
   * - fetchDatasets
  */

  fetchDatasets = debounce((page) => {
    this.props.setDatasetsPage(page);
    this.props.fetchDatasets();
  });

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
                    this.onTagSelected(t);
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
                    this.onTagSelected(t);
                  }}
                />
              }
              visible={tagsOpened}
              overlayClassName="c-rc-tooltip"
              placement="bottomRight"
              trigger="click"
              monitorWindowResize
              destroyTooltipOnHide
              getTooltipContainer={getTooltipContainer}
              onVisibleChange={this.onVisibleChange}
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
