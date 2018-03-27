import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'routes';

// Modal
import Modal from 'components/modal/modal-component';
import CreditsModal from 'components/modal/credits-modal';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreditsModal: false
    };
  }

  handleToggleCreditsModal = (bool) => {
    this.setState({ showCreditsModal: bool });
  }

  render() {
    const { skipAnimation, hideSkip, showEarthViewLink } = this.props;

    return (
      <div className="c-splash-header">
        <Link route="home">
          <img className="logo" src="/static/images/logo-resource-watch.png" alt="Resource Watch" />
        </Link>
        <div className="links">
          {showEarthViewLink &&
          <div className="earth-view-link">
            <a href="/splash">
              <img src="/static/images/splash/globe.svg" alt="Earth view" /><span className="link-text">Earth View</span>
            </a>
          </div>
          }
          <a
            role="button"
            tabIndex={0}
            onKeyDown={() => this.handleToggleCreditsModal(true)}
            onClick={() => this.handleToggleCreditsModal(true)}
          >
            Credits
            <Modal
              isOpen={this.state.showCreditsModal}
              className="-medium"
              onRequestClose={() => this.handleToggleCreditsModal(false)}
            >
              <CreditsModal />
            </Modal>
          </a>
          {!hideSkip && <button onClick={skipAnimation} className="c-splash-header-skip-intro">SKIP INTRO</button>}
          <Link route="home">
            <a>Go to Resource Watch</a>
          </Link>
        </div>
      </div>
    );
  }
}

Header.defaultProps = {
  showEarthViewLink: false
};

Header.propTypes = {
  showEarthViewLink: PropTypes.bool,
  skipAnimation: PropTypes.func.isRequired,
  hideSkip: PropTypes.bool
};

export default Header;
