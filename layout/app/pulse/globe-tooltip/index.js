import { Component, createElement } from 'react';

import GlobeTooltipComponent from './component';

class GlobeTooltipContainer extends Component {
  render() {
    return createElement(GlobeTooltipComponent, {
      ...this.props
    });
  }
}

export default GlobeTooltipContainer;
