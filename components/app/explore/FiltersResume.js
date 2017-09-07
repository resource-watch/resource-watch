import React from 'react';
import PropTypes from 'prop-types';

export default function FiltersResume({ topics, geographies, dataTypes }) {
  return (
    <div className="c-filters-resume">
      {topics.length > 0 &&
        <div className="filter-resume">
          <span className="filter-title">Topics:</span>
          <span className="filter-items">{topics.join(', ')}</span>
        </div>}
      {geographies.length > 0 &&
      <div className="filter-resume">
        <span className="filter-title">Geographies:</span>
        <span className="filter-items">{geographies.join(', ')}</span>
      </div>}
      {dataTypes.length > 0 &&
      <div className="filter-resume">
        <span className="filter-title">Data Types:</span>
        <span className="filter-items">{dataTypes.join(', ')}</span>
      </div>}
    </div>
  );
}

FiltersResume.propTypes = {
  topics: PropTypes.array,
  geographies: PropTypes.array,
  dataTypes: PropTypes.array
};

FiltersResume.defaultProps = {
  topics: [],
  geographies: [],
  dataTypes: []
};

