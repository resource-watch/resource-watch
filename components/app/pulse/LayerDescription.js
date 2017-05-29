import React from 'react';

class LayerDescription extends React.Component {
  render() {
    const { layerActive } = this.props;
    if (layerActive) {
      return (
        <div className="c-layer-description">
          <div className="layer-description-container">
            <p>{layerActive.description}</p>
          </div>
        </div>
      );
    }
    return null;
  }
}

LayerDescription.propTypes = {
  // PROPS
  layerActive: React.PropTypes.object
};


export default LayerDescription;
