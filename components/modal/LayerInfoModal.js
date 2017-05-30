import React from 'react';

class LayerInfoModal extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <div className="layer-info-modal">
        <div className="layer-info-content">
          <h1 className="c-text -header-normal -thin title">{data.name}</h1>
          <p>{data.description}</p>
        </div>
      </div>
    );
  }
}

LayerInfoModal.propTypes = {
  data: React.PropTypes.object
};


export default LayerInfoModal;
