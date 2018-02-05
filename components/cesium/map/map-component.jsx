import React, { Component, cloneElement } from 'react';
import { v1 as uuid } from 'uuid';

const layerId = layer => `${layer.type.name}-${uuid()}`;

class CesiumMap extends Component {
  render() {
    const {
      className,
      layers: cLayers,
      mapId,
      children,
      viewer,
      clickedPosition,
      hoverPosition,
    } = this.props;
    return (
      <div className={className} id={mapId}>
        {React.Children.map(children, (ch) => {
          if (!ch) return null;
          const id = layerId(ch);

          return cloneElement(ch, {
            cLayers,
            viewer,
            clickedPosition,
            hoverPosition,
            ref: () => {
              this[id] = Boolean(ch.props.url);
            },
          });
        })}
      </div>
    );
  }
}

export default CesiumMap;
