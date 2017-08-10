import React from 'react';

const LayerInfoModal = function LayerInfoModal(props) {
  return (
    <div className="layer-info-modal">
      <div className="layer-info-content">
        <h1 className="c-text -header-normal -thin title">{props.data.name}</h1>
        <p>{props.data.description}</p>
      </div>
    </div>
  );
};

LayerInfoModal.propTypes = {
  data: React.PropTypes.object
};

export default LayerInfoModal;
