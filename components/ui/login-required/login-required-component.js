import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Modal from 'components/modal/modal-component';
import LoginModal from 'components/modal/login-modal';

class LoginRequired extends PureComponent {
  static propTypes = {
    children: PropTypes.object,
    user: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  promptLogin(e) {
    e.preventDefault() && e.stopPropagation();
    this.setState({ isOpen: true });
  }

  closePrompt() {
    this.setState({ isOpen: false });
  }

  render() {
    const { user } = this.props;
    const { isOpen } = this.state;

    return user.token ? this.props.children : (
      <div
        className="c-login-required"
        onClickCapture={e => this.promptLogin(e)}
      >
        <Modal
          isOpen={isOpen}
          className="-medium"
          onRequestClose={() => this.closePrompt()}
        >
          <LoginModal
            {...this.props}
          />
        </Modal>
        {this.props.children}
      </div>
    );
  }
}

export default LoginRequired;
