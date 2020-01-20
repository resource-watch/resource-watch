import { Component, createElement } from 'react';

import WelcomeModal from './component';

class WelcomeModalContainer extends Component {
  render() {
    return createElement(WelcomeModal, { ...this.props });
  }
}

export default WelcomeModalContainer;
