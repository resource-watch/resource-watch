import React from 'react';
import PropTypes from 'prop-types';

// styles
import './styles.scss';

function CountryIndicators(props) {

    return (
        <div className="c-country-indicators">

        </div>
    );
};

CountryIndicators.propTypes = {
    country: PropTypes.object.isRequired
};

export default CountryIndicators;