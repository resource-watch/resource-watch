import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import ShareModalExplore from 'components/widgets/editor/modal/ShareModalExplore';
import Icon from 'components/widgets/editor/ui/Icon';

class ShareControl extends React.Component {
  static propTypes = {
    // ACTIONS
    toggleModal: PropTypes.func,
    setModalOptions: PropTypes.func
  };

  handleShareModal = () => {
    const options = {
      children: ShareModalExplore,
      childrenProps: {
        ...this.props,
        url: window.location.href,
        toggleModal: this.props.toggleModal
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  // RENDER
  render() {
    return (
      <button type="button" className="share-button" onClick={() => this.handleShareModal()}>
        <Icon name="icon-share" className="-small" />
      </button>
    );
  }
}

export default connect(
  null,
  {
    toggleModal,
    setModalOptions
  }
)(ShareControl);
