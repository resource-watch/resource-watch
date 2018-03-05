import { Component, createElement } from 'react';

import LegendComponent from './component';

class LegendContainer extends Component {
  render() {
    return createElement(LegendComponent, {
      ...this.props
    });
  }
}

export default LegendContainer;
