import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

// Components
import Icon from 'components/ui/Icon';

// Actions
import * as actions from 'redactions/dock';

// Services
import { EE } from 'services/Dock';

class Dock extends React.Component {
  componentDidMount() {
    const { toggleDock, setDockOptions } = this.props;

    EE.on('toggleDock', toggleDock);
    EE.on('setDockOptions', setDockOptions);

    this.el.addEventListener('transitionend', () => {
      if (!this.props.dock.opened) {
        setDockOptions({ children: null });
      }
    });
  }

  componentWillReceiveProps({ dock }) {
    function escKeyDownListener(e) {
      document.removeEventListener('keydown', escKeyDownListener);
      return e.keyCode === 27 && this.props.toggleDock(false);
    }
    // if opened property has changed
    if (this.props.dock.opened !== dock.opened) {
      document[dock.opened ? 'addEventListener' : 'removeEventListener']('keydown', escKeyDownListener.bind(this));
    }
  }

  componentWillUnmount() {
    EE.removeListener('toggleDock');
    EE.removeListener('setDockOptions');
  }

  getContent() {
    return this.props.dock.options.children ?
      <this.props.dock.options.children {...this.props.dock.options.childrenProps} /> : null;
  }

  render() {
    const { opened, options } = this.props.dock;

    const classNames = classnames({
      '-hidden': !opened,
      [options.size]: !!options.size
    });

    return (
      <section
        ref={(node) => { this.el = node; }}
        className={`c-dock ${classNames}`}
      >
        <div className="dock-container">
          <button
            className="dock-close"
            onClick={() => this.props.toggleDock(false)}
          >
            <Icon name="icon-cross" className="-big" />
          </button>
          <div className="dock-content">
            {this.getContent()}
          </div>
        </div>

        <area
          className="dock-backdrop"
          onClick={() => this.props.toggleDock(false)}
        />
      </section>
    );
  }
}

Dock.propTypes = {
  // STORE
  dock: PropTypes.object,

  // ACTIONS
  toggleDock: PropTypes.func,
  setDockOptions: PropTypes.func
};

export default connect(
  state => ({
    dock: state.dock
  }),
  actions
)(Dock);
