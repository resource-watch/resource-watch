import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import ModalComponent from 'components/modal/modal-component';
import LoginModal from 'components/modal/LoginModal';

class LoginRequired extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  promptLogin(event) {
    event.stopPropagation();
    this.setState({ isOpen: true });
  }

  closePrompt() {
    this.setState({ isOpen: false });
  }

  render() {
    const { user } = this.props;
    const { isOpen } = this.state;

    return user.token ? this.props.children : (
      <div className="c-login-required" onClickCapture={e => this.promptLogin(e)}>
        <ModalComponent isOpen={isOpen} onRequestClose={() => this.closePrompt()}>
          <LoginModal onRequestClose={() => this.closePrompt()} {...this.props} />
        </ModalComponent>
        {this.props.children}
      </div>
    );
  }
}

LoginRequired.propTypes = {
  children: PropTypes.object,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  isOpen: state.isOpen
});

export default connect(mapStateToProps)(LoginRequired);
