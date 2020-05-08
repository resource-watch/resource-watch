import React from 'react';
import PropTypes from 'prop-types';

// Components
import IndicatorCard from './indicator-card';

// Styles
import './styles.scss';

function CountryIndicators(props) {
  const { indicators, country } = props;

  return (
    <div className="c-country-indicators">
      {indicators && indicators.map(indicator =>
        (<IndicatorCard
          indicator={indicator}
          country={country}
        />))}
    </div>
  );
}

CountryIndicators.propTypes = {
  country: PropTypes.object.isRequired,
  indicators: PropTypes.array.isRequired
};

export default CountryIndicators;
