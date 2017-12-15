import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { toggleModal } from 'redactions/modal';

class SplashDetailModal extends React.Component {
  constructor(props) {
    super(props);

    //------- Bindings ---------------
    this.handleOk = this.handleOk.bind(this);
  }

  handleOk() {
    this.props.toggleModal(false);
  }

  render() {
    return (
      <div className="splash-detail-modal">
        <div className="content">
          {this.props.text}
          <div className="buttons">
            <button
              className="c-btn -secondary"
              onClick={this.handleMoreInfo}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    );
  }
}

SplashDetailModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  text: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
  toggleModal: open => dispatch(toggleModal(open))
});

export default connect(null, mapDispatchToProps)(SplashDetailModal);
