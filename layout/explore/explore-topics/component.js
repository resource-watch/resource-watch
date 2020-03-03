import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { TOPICS } from './constants';

import './styles.scss';

function ExploreTopicsComponent(props) {
  return (
    <div className="c-explore-topics">
      <div className="row">
        {TOPICS.map(topic => (
          <div className="column small-6">
            <div
              id={topic.id}
              className="explore-topic-button"
              style={{ backgroundImage: `url(${topic.backgroundURL}` }}
              role="button"
              tabIndex={0}
              onClick={() => {
                                props.setFiltersSelected({ key: 'topics', list: [topic.id] });
                                props.setDatasetsPage(1);
                                props.fetchDatasets();
                            }}
            >
              <div className="topic-title">
                {topic.label}
              </div>
            </div>
          </div>
                ))}
      </div>
    </div>
  );
}

ExploreTopicsComponent.propTypes = { setFiltersSelected: PropTypes.func.isRequired };

export default ExploreTopicsComponent;
