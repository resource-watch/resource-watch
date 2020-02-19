import React from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/icon';

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
          <Icon className="-small" name="icon-star-full" className="-small" />
          <span>SAVE</span>
        </button>
        <button className="c-btn -secondary -compressed">
          <Icon className="-small" name="icon-arrow-up-2" className="-small" />
          <span>SHARE</span>
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
