import React from 'react';
import Icon from '../Icon';
import Spinner from '../Spinner';

export default class Modal extends React.Component {

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
    return this.props.options.children ? <this.props.options.children {...this.props.options.childrenProps} /> : null;
  }

  render() {
    return (
      <section ref={(node) => { this.el = node; }} className={`c-modal ${this.props.open ? '' : '-hidden'} ${this.props.options.size || ''}`}>
        <div className="modal-container">
          <button className="modal-close" onClick={() => this.props.toggleModal(false)}>
            <Icon name="icon-cross" className="-big" />
          </button>
          <div className="modal-content">
            {this.props.loading ? <Spinner isLoading /> : this.getContent()}
          </div>
        </div>
        <area className="modal-backdrop" onClick={() => this.props.toggleModal(false)} />
      </section>
    );
  }
}

Modal.propTypes = {
  // STORE
  open: React.PropTypes.bool,
  options: React.PropTypes.object,
  loading: React.PropTypes.bool,
  // ACTIONS
  toggleModal: React.PropTypes.func,
  setModalOptions: React.PropTypes.func
};

Modal.defaultProps = {
  open: false,
  options: {}
};
