import { Component } from 'react';
import includes from 'lodash/includes'
;
const { Cesium } = window;

class Billboard extends Component {
  componentWillUnmount() {
    const { viewer } = this.props;
    viewer.entities.remove(this.entity);
  }
  handleHover = (hoverPosition) => {
    const { viewer } = this.props;
    if (!viewer) return false;
    const { scene } = viewer;
    const pickedObject = scene.pick(hoverPosition);

    viewer.entities.values.map((bill) => {
      if (!bill.billboard) return bill;
      if (pickedObject) {
        if (pickedObject.id.id === bill.id) {
          bill.billboard.image = bill.imageHover;
        } else {
          bill.billboard.image = bill.image;
        }
      } else {
        bill.billboard.image = bill.image;
      }
    });
  }

  handleClick = (clickedPosition) => {
    const { viewer, onClick, id } = this.props;
    if (!viewer) return false;
    const { scene } = viewer;
    const pickedObject = scene.pick(clickedPosition);
    if (Cesium.defined(pickedObject) && pickedObject.id.id === id) {
      onClick(pickedObject.id.id);
    }
  }

  mountBillboard = (viewer) => {
    const {
      id,
      url: image,
      urlHover: imageHover,
      width,
      height,
      position: [lat, long],
      verticalOrigin,
    } = this.props;
    if (!viewer) return false;
    this.entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lat, long),
      id,
      image,
      imageHover,
      billboard: {
        image,
        imageHover,
        width,
        height,
        verticalOrigin,
      },
    });
  }

  render() {
    const {
      viewer,
      id,
      clickedPosition,
      hoverPosition,
    } = this.props;

    if (viewer) {
      const existing = viewer.entities.values.map(e => e.id);
      if (!includes(existing, id)) this.mountBillboard(viewer);
      if (clickedPosition) this.handleClick(clickedPosition);
      if (hoverPosition) this.handleHover(hoverPosition);
    }

    return null;
  }
}

export default Billboard;
