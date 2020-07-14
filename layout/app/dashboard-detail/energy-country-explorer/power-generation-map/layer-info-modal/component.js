import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// styles
import './styles.scss';

function LayerInfoModal(props) {
    const { layer } = props;

    return (
        <div className="c-layer-info-modal">
            <h2>{layer.name}</h2>
            <p>
                {layer.description}
            </p>
            <div className="actions">
                <button
                    className="c-button -primary"
                    onClick={() => {
                        Router.pushRoute('explore', {
                            dataset: layer.dataset,
                            layer: layer.id
                        });
                    }}
                >
                    More info
                </button>
            </div>
        </div>
    );
};

LayerInfoModal.propTypes = {
    layer: PropTypes.object.isRequired
};

export default LayerInfoModal;
