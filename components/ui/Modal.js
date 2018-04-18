import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';

export default class Modal extends React.Component {
  static propTypes = {
    // STORE
    open: PropTypes.bool,
    options: PropTypes.object,
    className: PropTypes.string,
    loading: PropTypes.bool,
    // ACTIONS
    toggleModal: PropTypes.func,
    setModalOptions: PropTypes.func
  };

  static defaultProps = {
    open: false,
    options: {}
  };

  componentDidMount() {
    this.el.addEventListener('transitionend', () => {
      if (!this.props.open) {
        this.props.setModalOptions({ children: null });
      }
    });
  }

  // Close modal when esc key is pressed
  componentWillReceiveProps({ open }) {
    const self = this;
    function escKeyPressListener(evt) {
      document.removeEventListener('keydown', escKeyPressListener);
      return evt.keyCode === 27 && self.props.toggleModal(false);
    }
    // if open property has changed
    if (this.props.open !== open) {
      document[open ? 'addEventListener' : 'removeEventListener']('keydown', escKeyPressListener);
    }
  }

  getContent() {
    return this.props.options.children ?
      <this.props.options.children {...this.props.options.childrenProps} /> : null;
  }

  render() {
    const { options, open, className } = this.props;
    return (
      <section
        ref={(node) => { this.el = node; }}
        className={`c-modal ${open ? '' : '-hidden'} ${options.size || ''} ${className || ''}`}
      >
        <div className="modal-container">
          <button className="modal-close" onClick={() => this.props.toggleModal(false)}>
            <Icon name="icon-cross" className="-small" />
          </button>
          <div className="modal-content">
            {this.props.loading ? <Spinner isLoading /> : this.getContent()}
          </div>
        </div>
        <div
          className="modal-backdrop"
          onClick={() => this.props.toggleModal(false)}
        />
      </section>
    );
  }
}
