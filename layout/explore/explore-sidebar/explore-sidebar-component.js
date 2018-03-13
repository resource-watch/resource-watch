import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Utils
import { logEvent } from 'utils/analytics';

// Components
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';

class ExploreSidebarComponent extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    open: PropTypes.bool,
    loading: PropTypes.bool,

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
      logEvent('Explore Map', 'Sidebar', 'Expand sidebar');
    } else {
      logEvent('Explore Map', 'Sidebar', 'Collapse sidebar');
    }
  }

  render() {
    const { open, loading } = this.props;

    return (
      <aside
        className={classnames({
          'c-sidebar': true,
          '-open': open
        })}
      >
        <button
          type="button"
          className="btn-toggle"
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

        {loading && <Spinner isLoading className="-light" />}

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
