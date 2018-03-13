import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Utils
import { logEvent } from 'utils/analytics';

// Components
import Icon from 'components/ui/Icon';

class ExploreSidebarComponent extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    open: PropTypes.bool,

    // Actions
    setSidebarOpen: PropTypes.func
  };

  /**
   * UI EVENTS
   * - triggerToggle
  */
  triggerToggle = () => {
    const { open } = this.props;

    // Toggle sidebar
    this.props.setSidebarOpen(!open);

    // Analytics
    if (!open) {
      logEvent('Explore Map', 'Expand Map', 'Expand explore menu');
    } else {
      logEvent('Explore Map', 'Expand Map', 'Collapse explore menu');
    }
  }

  render() {
    const { open } = this.props;
    const openedClass = (open) ? '-opened' : '';

    return (
      <aside
        className={classnames({
          'c-sidebar': true,
          '-opened': open
        })}
      >
        <button
          type="button"
          className={`c-sidebar-toggle btn-toggle ${openedClass}`}
          onClick={this.triggerToggle}
        >
          <Icon
            className={classnames({
              '-little': true,
              '-left': open,
              '-right': !open
            })}
            name="icon-arrow-down"
          />
        </button>

        <div
          className="sidebar-content"
          // onScroll={() => this.handleScroll()}
        >
          {this.props.children}
        </div>
      </aside>
    );
  }
}

export default ExploreSidebarComponent;
