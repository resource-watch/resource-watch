import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { EXPLORE_SECTIONS } from 'layout/explore/constants';
import { TOPICS } from './constants';

// Components
import TopicsList from './list';

function ExploreTopicsComponent(props) {
  const clickHandler = (id) => {
    props.setFiltersSearch('');
    props.resetFiltersSort();
    props.setFiltersSelected({ key: 'topics', list: [id] });
    props.setDatasetsPage(1);
    props.fetchDatasets();
    props.setSidebarSection(EXPLORE_SECTIONS.ALL_DATA);
  };

  return (
    <div className="c-explore-topics">
      <TopicsList topics={TOPICS} onClick={clickHandler} />
    </div>
  );
}

ExploreTopicsComponent.propTypes = {
  setFiltersSelected: PropTypes.func.isRequired,
  setDatasetsPage: PropTypes.func.isRequired,
  fetchDatasets: PropTypes.func.isRequired,
  resetFiltersSort: PropTypes.func.isRequired,
  setSidebarSection: PropTypes.func.isRequired,
  setFiltersSearch: PropTypes.func.isRequired,
};

export default ExploreTopicsComponent;
