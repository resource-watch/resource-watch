import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import { toastr } from 'react-redux-toastr';

// services
import { cloneDashboard } from 'services/dashboard';

class ImportSelector extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    topics: PropTypes.array.isRequired
  };

  state = { isOpen: false }

  onCloneDashboard = ({ id }) => {
    const { user } = this.props;

    toastr.confirm('Are you sure you want to clone this topic?', {
      onOk: () => {
        cloneDashboard(id, user)
          .then((dashboard) => {
            const { id: dashboardId } = dashboard;
            window.open(`/myrw-detail/dashboards/${dashboardId}`, '_blank');
          })
          .catch((error) => {
            const { message } = error;
            toastr.error(message);
          });
      }
    });
  }

  render() {
    const { topics } = this.props;
    const { isOpen } = this.state;

    return (
      <TetherComponent
        attachment="top center"
        constraints={[{ to: 'window' }]}
        targetOffset="0 0"
        classes={{ element: 'c-header-dropdown' }}
      >
        <li
          className="template-list-item"
          onMouseEnter={() => this.setState({ isOpen: true })}
          onMouseLeave={() => this.setState({ isOpen: false })}
        >
          <h4 className="template-name">Clone a topic page</h4>
          <span className="template-description">Clone a topic page into a new dashboard</span>
        </li>
        {isOpen &&
          <ul
            className="header-dropdown-list"
            onMouseEnter={() => this.setState({ isOpen: true })}
            onMouseLeave={() => this.setState({ isOpen: false })}
          >
            {topics.map(_topic => (
              <li
                className="header-dropdown-list-item"
                key={_topic.id}
              >
                <span onClick={() => this.onCloneDashboard(_topic)}>{_topic.name}</span>
              </li>
            ))}
          </ul>
        }
      </TetherComponent>
    );
  }
}

export default ImportSelector;
