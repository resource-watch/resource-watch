import React from 'react';
import PropTypes from 'prop-types';

// Components
import ExploreMap from 'layout/explore/explore-map';
import MapMenu from './map-menu';

// Styles
import './styles.scss';

function PowerGenerationMap(props) {
    const { selectedCountry, mapTitle, groups } = props;

    return (
        <div className="c-power-generation-map">
            <div className="header">
                <h4>{mapTitle}</h4>
            </div>
            <div className="main-container">
                <MapMenu
                    groups={groups}
                />
                <div className="map-container" >
                    <ExploreMap />
                </div>
            </div>
        </div>
    );
}

PowerGenerationMap.propTypes = {
    selectedCountry: PropTypes.string.isRequired,
    mapTitle: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired
};

export default PowerGenerationMap;
