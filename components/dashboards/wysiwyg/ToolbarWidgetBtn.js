import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleModal } from 'redactions/modal';

import ToolbarWidgetModal from 'components/dashboards/wysiwyg/ToolbarWidgetModal';

class ToolbarWidgetBtn extends React.Component {
  static propTypes = {
    toggleModal: PropTypes.func
  };

  openModal = () => {
    this.props.toggleModal(true, {
      children: ToolbarWidgetModal,
      childrenProps: this.props
    });
  };

  render() {
    return (
      <button
        type="button"
        className="c-button -primary -compressed"
        onClick={this.openModal}
      >
        Add widget
      </button>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleModal
}, dispatch);

export default connect(null, mapDispatchToProps)(ToolbarWidgetBtn);
