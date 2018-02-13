import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Modal from 'react-modal';
import Icon from 'components/ui/Icon';

class ModalComponent extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      isOpen,
      className,
      header,
      children,
      onRequestClose
    } = this.props;

    const classNames = classnames({
      [className]: !!className
    });

    return (
      <Modal
        className={`c-modal2 ${classNames}`}
        overlayClassName="c-modal2-overlay"
        bodyOpenClassName="-no-scroll"
        isOpen={isOpen}
        ariaHideApp={false}
        onAfterOpen={this.props.onAfterOpen}
        onRequestClose={this.props.onRequestClose}
      >
        {header}
        <button
          className="modal-close"
          onClick={onRequestClose}
        >
          <Icon name="icon-cross" className="-small" />
        </button>
        <div className="modal-content">
          {children}
        </div>
      </Modal>
    );
  }
}

ModalComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  className: PropTypes.string,
  // Content
  children: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
  // Func
  onAfterOpen: PropTypes.func,
  onRequestClose: PropTypes.func.isRequired
};

ModalComponent.defaultProps = {
};

export default ModalComponent;
