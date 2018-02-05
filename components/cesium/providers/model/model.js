import { Component } from 'react';

const { Cesium } = window;

class ModelProvider extends Component {
  componentWillUnmount() {
    const { viewer } = this.props;
    viewer.scene.primitives.remove(this.model);
  }
  componentWillReceiveProps({
    viewer,
    url,
    coordinates,
    scale,
    animate,
    speed = 1,
  }) {
    if (this.model) return;
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(...coordinates));
    const model = (this.model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
      url,
      modelMatrix,
      scale,
    })));

    if (animate) {
      Cesium.when(model.readyPromise).then((model) => {
        model.activeAnimations.addAll({
          loop: Cesium.ModelAnimationLoop.REPEAT,
          speedup: speed,
        });
      });
    }
  }

  render() {
    return null;
  }
}

export default ModelProvider;
