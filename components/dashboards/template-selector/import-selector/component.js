import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import TetherComponent from 'react-tether';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';



class HeaderTopics extends PureComponent {
  static propTypes = {
    topics: PropTypes.array.isRequired,
    setDropdownOpened: PropTypes.func.isRequired
  };

  toggleDropdown = debounce((bool) => {
    this.props.setDropdownOpened({ topics: bool });
  }, 50)


  state = { isOpen: false }


  handleTopics = ({ id }) => {
    toastr.confirm('Are you sure you want to copy this topic?', {
      onOk: () => {
        fetch(`${process.env.WRI_API_URL}/topics/${id}/clone-dashboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.props.user.token
          }
        })
          .then((response) => {
            if (response.status >= 400) throw new Error(response.statusText);
            return response.json();
          })
          .then(() => {
            Router.pushRoute('myrw_detail', { tab: 'dashboards', id: '16', subtab: 'edit' });
          })
      }
    })
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
          <h4 className="template-name">Import dashboard</h4>
          <span className="template-description">Select a created dashboard</span>
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
                <span onClick={() => this.handleTopics(_topic)}>{_topic.name}</span>
              </li>
            ))}
          </ul>
        }
      </TetherComponent>
    );
  }
}

export default HeaderTopics;
