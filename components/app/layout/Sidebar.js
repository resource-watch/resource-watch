import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { setSidebar } from 'redactions/explore';
import MediaQuery from 'react-responsive';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: props.sidebar.open
    };

    this.triggerToggle = this.triggerToggle.bind(this);
  }

  componentDidMount() {
    const options = {
      width: this.sidebarNode.offsetWidth,
      open: true
    };
    this.props.setSidebar(options);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.sidebar.open });
  }

  /**
   * UI EVENTS
   * - triggerToggle
  */
  triggerToggle() {
    const options = {
      width: this.sidebarNode.offsetWidth,
      open: !this.state.open
    };
    this.props.setSidebar(options);
  }

  render() {
    const openedClass = (this.state.open) ? '-opened' : '';

    return (
      <aside ref={(node) => { this.sidebarNode = node; }} className={`c-sidebar ${openedClass}`}>
        <MediaQuery minDeviceWidth={720} values={{ deviceWidth: 720 }}>
          <button type="button" className={`l-sidebar-toggle btn-toggle ${openedClass}`} onClick={this.triggerToggle}>
            <Icon className={classnames('-little', `-${this.state.open ? 'left' : 'right'}`)} name="icon-arrow-down" />
          </button>
        </MediaQuery>

        <div className="sidebar-content">
          {this.props.children}
        </div>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  children: PropTypes.any,
  sidebar: PropTypes.object,
  setSidebar: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  setSidebar: (options) => { dispatch(setSidebar(options)); }
});

const mapStateToProps = state => ({
  sidebar: state.explore.sidebar
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
