import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

// components
import Modal from 'components/modal/modal-component';
import LoginModal from 'components/modal/login-modal';

class LoginRequired extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
  }

  promptLogin = (e) => {
    const { clickCallback } = this.props;
    e.stopPropagation();
    e.preventDefault();
    this.setState({ isOpen: true });
    if (clickCallback) clickCallback();
  }

  closePrompt = () => { this.setState({ isOpen: false }); }

  render() {
    const { user, children, redirect } = this.props;
    const { isOpen } = this.state;

    return user.token ? children : (
      <>
        <div
          className="c-login-required"
          onClickCapture={this.promptLogin}
        >
          {children}
        </div>
        <Modal
          isOpen={isOpen}
          onRequestClose={this.closePrompt}
        >
          <LoginModal redirect={redirect} />
        </Modal>
      </>
    );
  }
}

LoginRequired.defaultProps = {
  clickCallback: null,
  redirect: true,
};

LoginRequired.propTypes = {
  children: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  redirect: PropTypes.bool,
  clickCallback: PropTypes.func,
};

export default LoginRequired;
