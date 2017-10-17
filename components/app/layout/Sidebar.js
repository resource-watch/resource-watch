import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import debounce from 'lodash/debounce';

// Redux
import { connect } from 'react-redux';
import { setSidebar } from 'redactions/explore';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Icon from 'components/ui/Icon';


class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: props.sidebar.open
    };

    this.triggerToggle = this.triggerToggle.bind(this);
    this.triggerResize = debounce(this.triggerResize.bind(this), 500);
    this.handleScroll = debounce(this.handleScroll.bind(this), 30);
  }

  componentDidMount() {
    const options = {
      width: this.sidebarNode.offsetWidth,
      open: true
    };
    this.props.setSidebar(options);

    window.addEventListener('resize', this.triggerResize);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.sidebar.open });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.triggerResize);
  }

  triggerResize() {
    this.props.setSidebar({ width: this.sidebarNode.offsetWidth });
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

  handleScroll() {
    this.props.toggleTooltip(false);
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

        <div className="sidebar-content" onScroll={() => this.handleScroll()}>
          {this.props.children}
        </div>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  children: PropTypes.any,
  sidebar: PropTypes.object,
  setSidebar: PropTypes.func,
  // Store
  toggleTooltip: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  setSidebar: (options) => { dispatch(setSidebar(options)); },
  toggleTooltip: (opened, opts) => { dispatch(toggleTooltip(opened, opts)); }
});

const mapStateToProps = state => ({
  sidebar: state.explore.sidebar
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
