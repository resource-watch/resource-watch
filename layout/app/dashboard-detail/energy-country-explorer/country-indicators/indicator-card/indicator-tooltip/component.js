import React from 'react';
import PropTypes from 'prop-types';

// Styles
import './styles.scss';

function IndicatorTooltip(props) {
    const { ranking, count } = props;

    return (
        <div className="c-indicator-tooltip">
            <div className="text">Rank</div>
            <div className="value">{ranking}</div>
            <div className="text">of {count} countries</div>
        </div>
    );
}

IndicatorTooltip.propTypes = {
    ranking: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired
}

export default IndicatorTooltip;