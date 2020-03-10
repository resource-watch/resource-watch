import React from 'react';
import PropTypes from 'prop-types';

// Components

// Explore components

// Styles
import './styles.scss';

function ExploreNearRealTimeComponent(props) {
  const { datasets } = props;

  return (
    <div className="c-explore-near-real-time" />
  );
}

ExploreNearRealTimeComponent.propTypes = { datasets: PropTypes.array.isRequired };

export default ExploreNearRealTimeComponent;
