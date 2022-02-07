import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Modal from 'react-modal';
import Icon from 'components/ui/icon';

class ModalComponent extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    className: PropTypes.string,
    // Content
    children: PropTypes.node.isRequired,
    header: PropTypes.node,
    // Func
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onAfterOpen: null,
    className: null,
    header: null,
  };

  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { isOpen, className, header, onAfterOpen, onRequestClose } = this.props;
    const classNames = classnames({ [className]: !!className });
    return (
      <Modal
        className={`c-modal2 ${classNames}`}
        overlayClassName="c-modal2-overlay"
        bodyOpenClassName="-no-scroll"
        isOpen={isOpen}
        ariaHideApp={false}
        {...(onAfterOpen && { onAfterOpen })}
        onRequestClose={onRequestClose}
      >
        {header}

        <button className="modal-close" onClick={(e) => e.stopPropagation() || onRequestClose()}>
          <Icon name="icon-cross" className="-small" />
        </button>

        <div className="modal-content">{this.props.children}</div>
      </Modal>
    );
  }
}

export default ModalComponent;
