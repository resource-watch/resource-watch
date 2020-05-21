import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components
import ExploreMap from 'layout/explore/explore-map';
import Modal from 'components/modal/modal-component';
import MapMenu from './map-menu';
import LayerInfoModal from './layer-info-modal';

// Styles
import './styles.scss';

function PowerGenerationMap(props) {
    const { mapTitle, groups, bbox, setBounds } = props;
    const [layerModalOpen, setLayerModalOpen] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState(null);

    useEffect(() => {
        if (bbox) {
            setBounds({ bbox, options: {} });
        }
    }, [bbox]);
    
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
                    <ExploreMap
                        exploreDefault={false}
                        onLayerInfoButtonClick={(layer) => {
                            setSelectedLayer(layer);
                            setLayerModalOpen(true);
                        }}
                    />
                </div>
            </div>
            <Modal
                isOpen={layerModalOpen}
                onRequestClose={() => setLayerModalOpen(false)}
                className="-medium"
            >
                { selectedLayer && <LayerInfoModal layer={selectedLayer} /> }
            </Modal>
        </div>
    );
}

PowerGenerationMap.propTypes = {
    mapTitle: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
    bbox: PropTypes.array
};

PowerGenerationMap.defaultProps = {
    bbox: null
}

export default PowerGenerationMap;
