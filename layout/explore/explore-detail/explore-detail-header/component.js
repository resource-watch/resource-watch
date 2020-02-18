import React from 'react';
import PropTypes from 'prop-types';

// Styles
import './styles.scss';

function ExploreDetailHeaderComponent(props) {
  const { setSelectedDataset } = props;
  return (
    <div className="c-explore-detail-header">
      <button
        className="c-btn -primary -compressed"
        onClick={() => setSelectedDataset(null)}
      >
        {'< ALL DATASETS'}
      </button>
      <div className="right-buttons">
        <button className="c-btn -secondary -compressed">
                    SAVE
        </button>
        <button className="c-btn -secondary -compressed">
                    SHARE
        </button>
      </div>
    </div>
  );
}

ExploreDetailHeaderComponent.propTypes = {
  // Store
  setSelectedDataset: PropTypes.func.isRequired
};

export default ExploreDetailHeaderComponent;
