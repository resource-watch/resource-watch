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
          {this.props.markup}
          <div className="buttons">
            <button
              className="c-btn -secondary"
              onClick={this.handleOk}
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
  markup: PropTypes.object
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(null, mapDispatchToProps)(SplashDetailModal);
