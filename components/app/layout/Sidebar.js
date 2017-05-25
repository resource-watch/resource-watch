import React from 'react';
import Icon from 'components/ui/Icon';

export default class Sidebar extends React.Component {

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
        <button type="button" className={`l-sidebar-toggle btn-toggle ${openedClass}`} onClick={this.triggerToggle}>
          {this.state.open &&
            <Icon className="-little" name="icon-arrow-left" />
          }
          {!this.state.open &&
            <Icon className="-little" name="icon-arrow-right" />
          }
        </button>

        <div className="sidebar-content">
          {this.props.children}
        </div>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  children: React.PropTypes.any,
  sidebar: React.PropTypes.object,
  setSidebar: React.PropTypes.func
};
