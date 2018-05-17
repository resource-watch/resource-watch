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

  promptLogin = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ isOpen: true });
  }

  closePrompt = () => {
    this.setState({ isOpen: false });
  }

  render() {
    const { user, text } = this.props;
    const { isOpen } = this.state;

    return user.token ? this.props.children : (
      <fragment>
        <div
          className="c-login-required"
          onClickCapture={this.promptLogin}
        >
          {this.props.children}
        </div>
        <Modal
          isOpen={isOpen}
          className="-medium"
          onRequestClose={this.closePrompt}
        >
          <LoginModal text={ text || ''} />
        </Modal>
      </fragment>
    );
  }
}

export default LoginRequired;
