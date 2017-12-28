import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { toggleModal } from 'redactions/modal';

class LayerInfoModal extends React.Component {
  constructor(props) {
    super(props);

    // ------------------- Bindings -----------------------
    this.handleMoreInfo = this.handleMoreInfo.bind(this);
    // ----------------------------------------------------
  }

  handleMoreInfo() {
    this.props.toggleModal(false);
    Router.pushRoute('explore_detail', { id: this.props.data.dataset });
  }

  render() {
    return (
      <div className="layer-info-modal">
        <div className="layer-info-content">
          <h2>{this.props.data.name}</h2>
          <p>{this.props.data.description}</p>
          <div className="buttons">
            <button
              className="c-btn -primary"
              onClick={this.handleMoreInfo}
            >More info</button>
          </div>
        </div>
      </div>
    );
  }
}

LayerInfoModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  data: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
  toggleModal: open => dispatch(toggleModal(open))
});

export default connect(null, mapDispatchToProps)(LayerInfoModal);
