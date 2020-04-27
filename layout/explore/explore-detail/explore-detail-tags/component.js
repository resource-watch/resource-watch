import React from 'react';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

// Constants
import { EXPLORE_SECTIONS } from 'layout/explore/constants';

// styles
import './styles.scss';

function ExploreDetailTags(props) {
  const { tags } = props;

  const getFilterObject = (tag) => {
    const { id, labels } = tag;

    let keySt = 'topics';
    if (labels.includes('TOPIC')) {
      keySt = 'topics';
    } else if (labels.includes('GEOGRAPHY')) {
      keySt = 'geographies';
    } else if (labels.includes('DATA_TYPE')) {
      keySt = 'dataTypes';
    }

    return { key: keySt, list: [id] };
  };

  return (
    <div className="c-explore-detail-tags">
      <div className="title">
        <h4>Tags</h4>
      </div>
      <div className="tags">
        {tags.map(tag => (
          <button
            className="c-button -secondary -compressed"
            onClick={() => {
              props.setSelectedDataset(null);
              props.setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
              props.setFiltersSelected(getFilterObject(tag));
              props.setDatasetsPage(1);
              props.fetchDatasets();
              logEvent('Explore (Detail)', 'Clicks Tag', tag.id);
            }}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}

ExploreDetailTags.propTypes = {
  tags: PropTypes.object.isRequired,
  setFiltersSelected: PropTypes.func.isRequired,
  setDatasetsPage: PropTypes.func.isRequired,
  fetchDatasets: PropTypes.func.isRequired,
  setSelectedDataset: PropTypes.func.isRequired,
  setSidebarSection: PropTypes.func.isRequired
};

export default ExploreDetailTags;
