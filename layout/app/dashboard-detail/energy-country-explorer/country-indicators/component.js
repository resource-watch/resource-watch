import React from 'react';
import PropTypes from 'prop-types';

// Components
import IndicatorCard from './indicator-card';

// Constants
import { WORLD_COUNTRY } from 'layout/app/dashboard-detail/energy-country-explorer/constants';

// Styles
import './styles.scss';

function CountryIndicators(props) {
  const { indicators, country } = props;

  return (
    <div className="c-country-indicators">
      {indicators && indicators.filter(i => 
          (country.value === WORLD_COUNTRY.value) ? 
            i.world : i.country
          ).map(indicator =>
          (<IndicatorCard
            indicator={indicator}
            country={country}
            key={`indicator-${indicator.datasetID}`}
          />))}
    </div>
  );
}

CountryIndicators.propTypes = {
  country: PropTypes.object.isRequired,
  indicators: PropTypes.array.isRequired
};

export default CountryIndicators;
