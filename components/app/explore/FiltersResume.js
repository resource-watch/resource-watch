import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

export default function FiltersResume ({ topics, geographies, types }) {
  return (
    <div className="c-filters-resume">
      {topics.length > 0 &&
        <div className="filter-resume">
          <span className="filter-title">Topics:</span>
          <ul className="filter-list">
            {topics.map((topic, i) =>
              <li
                key={topic}
                className="filter-item">
                  {topic}{`${i !== topics.length - 1 ? ',' : ''}`}
              </li>)}
          </ul>
        </div>}
      {geographies.length > 0 &&
      <div className="filter-resume">
        <span className="filter-title">Geographies:</span>
        <ul className="filter-list">
          {geographies.map((geography, i) =>
            <li
              key={geography}
              className="filter-item">
                {capitalize(geography || '')}{`${i !== geographies.length - 1 ? ',' : ''}`}
            </li>)}
        </ul>
      </div>}
      {types.length > 0 &&
      <div className="filter-resume">
        <span className="filter-title">Types:</span>
        <ul className="filter-list">
          {types.map((type, i) =>
            <li
              key={type}
              className="filter-item">
                {type}{`${i !== types.length - 1 ? ',' : ''}`}
            </li>)}
        </ul>
      </div>}
    </div>
  );
}

FiltersResume.propTypes = {
  topics: PropTypes.array,
  geographies: PropTypes.array,
  types: PropTypes.array
};

FiltersResume.defaultProps = {
  topics: [],
  geographies: [],
  types: []
};

