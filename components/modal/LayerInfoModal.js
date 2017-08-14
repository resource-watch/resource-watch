import React from 'react';

const LayerInfoModal = function LayerInfoModal(props) {
  return (
    <div className="layer-info-modal">
      <div className="layer-info-content">
        <h2>{props.data.name}</h2>
        <p>{props.data.description}</p>
      </div>
    </div>
  );
};

LayerInfoModal.propTypes = {
  data: React.PropTypes.object
};

export default LayerInfoModal;
