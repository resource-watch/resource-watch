import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import debounce from 'lodash/debounce';
import TetherComponent from 'react-tether';

class HeaderTopics extends PureComponent {
  static propTypes = {
    header: PropTypes.object.isRequired,
    topics: PropTypes.array.isRequired,
    setDropdownOpened: PropTypes.func.isRequired
  };

  toggleDropdown = debounce((bool) => {
    this.props.setDropdownOpened({ topics: bool });
  }, 50)

  render() {
    const { header, topics } = this.props;

    return (
      <TetherComponent
        attachment="top center"
        constraints={[{ to: 'window' }]}
        targetOffset="0 0"
        classes={{ element: 'c-header-dropdown' }}
      >
        {/* First child: This is what the item will be tethered to */}
        <Link route="topics">
          <a
            onMouseEnter={() => this.toggleDropdown(true)}
            onMouseLeave={() => this.toggleDropdown(false)}
          >
            Topics
          </a>
        </Link>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {header.dropdownOpened.topics &&
          <ul
            className="header-dropdown-list"
            onMouseEnter={() => this.toggleDropdown(true)}
            onMouseLeave={() => this.toggleDropdown(false)}
          >
            {topics.map(_topic => (
              <li
                className="header-dropdown-list-item"
                key={_topic.label}
              >
                <Link
                  route={_topic.route}
                  params={_topic.params}
                >
                  <a>{_topic.label}</a>
                </Link>
              </li>
            ))}
          </ul>
      }
      </TetherComponent>
    );
  }
}

export default HeaderTopics;
