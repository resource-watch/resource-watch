import React from 'react';
import PropTypes from 'prop-types';

// styles
import './styles.scss';

function RankingBar(props) {
  const { count, ranking } = props;

  const pointPosition = ranking * 100 / count;
  console.log('pointPosition', pointPosition);
  
  return (
    <div className="c-ranking-bar">
      <div className="bar">
        <div
            className="point"
            style={{ left: `${pointPosition}%` }}
        />
      </div>
    </div>
  );
}

RankingBar.propTypes = {
  indicator: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired
};

export default RankingBar;
