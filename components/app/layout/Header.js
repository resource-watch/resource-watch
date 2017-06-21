import React from 'react';
import { Link } from 'routes';
import debounce from 'lodash/debounce';

// Components
import TetherComponent from 'react-tether';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dataDropdownActive: false,
      aboutDropdownActive: false
    };

    this.listeners = {};

    // BINDINGS
    this.toggleDropdown = debounce(this.toggleDropdown.bind(this), 50);
  }

  // This function is debounced. If you don't do that insane things will happen
  toggleDropdown(specificDropdown, to) {
    this.setState({
      ...{ dataDropdownActive: false, aboutDropdownActive: false },
      [specificDropdown]: to
    });
  }

  render() {
    const dataDropDown = (
      <TetherComponent
        attachment="top center"
        constraints={[{
          to: 'window'
        }]}
        targetOffset="-4px 0"
        classes={{
          element: 'c-header-dropdown'
        }}
      >
        {/* First child: This is what the item will be tethered to */}
        <Link route="data" >
          <a
            ref={(c) => { this.dataDropdownBtn = c; }}
            onMouseEnter={e => this.toggleDropdown('dataDropdownActive', true)}
            onMouseLeave={e => this.toggleDropdown('dataDropdownActive', false)}
          >
            Data
          </a>
        </Link>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.state.dataDropdownActive &&
          <ul
            className="header-dropdown-list"
            onMouseEnter={e => this.toggleDropdown('dataDropdownActive', true)}
            onMouseLeave={e => this.toggleDropdown('dataDropdownActive', false)}
          >
            <li className="header-dropdown-list-item">
              <Link
                route="explore"
                onClick={e => this.toggleDropdown('dataDropdownActive', false)}
              >
                <a>Explore Datasets</a>
              </Link>
            </li>
            <li className="header-dropdown-list-item">
              <Link
                route="dashboards"
                onClick={e => this.toggleDropdown('dataDropdownActive', false)}
              >
                <a>Dashboards</a>
              </Link>
            </li>
            <li className="header-dropdown-list-item">
              <Link
                route="pulse"
                onClick={e => this.toggleDropdown('dataDropdownActive', false)}
              >
                <a>Planet Pulse</a>
              </Link>
            </li>
            <li className="header-dropdown-list-item">
              <Link
                route="get_involved"
                onClick={e => this.toggleDropdown('dataDropdownActive', false)}
              >
                <a>Explore Tools</a>
              </Link>
            </li>
          </ul>
        }
      </TetherComponent>
      );

    const aboutDropDown = (
      <TetherComponent
        attachment="top center"
        constraints={[{
          to: 'window'
        }]}
        targetOffset="-4px 0"
        classes={{
          element: 'c-header-dropdown'
        }}
      >
        {/* First child: This is what the item will be tethered to */}
        <Link route="about" >
          <a
            ref={(c) => { this.aboutDropdownBtn = c; }}
            onMouseEnter={e => this.toggleDropdown('aboutDropdownActive', true)}
            onMouseLeave={e => this.toggleDropdown('aboutDropdownActive', false)}
          >
            About
          </a>
        </Link>

        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.state.aboutDropdownActive &&
          <ul
            className="header-dropdown-list"
            onMouseEnter={e => this.toggleDropdown('aboutDropdownActive', true)}
            onMouseLeave={e => this.toggleDropdown('aboutDropdownActive', false)}
          >
            <li className="header-dropdown-list-item">
              <Link
                route="about"
                onClick={e => this.toggleDropdown('aboutDropdownActive', false)}
              >
                <a>About</a>
              </Link>
            </li>
            <li className="header-dropdown-list-item">
              <Link
                route="about_partners"
                onClick={e => this.toggleDropdown('aboutDropdownActive', false)}
              >
                <a>Partners</a>
              </Link>
            </li>
          </ul>
        }
      </TetherComponent>
    );

    const items = [
      { name: 'Data', component: dataDropDown },
      { name: 'Insights', component: <Link route="insights"><a>Insights</a></Link> },
      { name: 'About', component: aboutDropDown },
      { name: 'Get Involved', component: <Link route="get_involved"><a>Get Involved</a></Link> }
    ];

    return (
      <header className="c-header">
        <div className="header-secondary">
          {/* We will load the script generated */}
        </div>
        <div className="header-main">
          <h1 className="header-logo">
            <Link route="home">
              <a>
                <svg><use xlinkHref="#icon-logo" /></svg>
                <span>Resource Watch</span>
              </a>
            </Link>
          </h1>
          <nav className="header-menu">
            <ul>
              {items.map(item => (
                <li key={item.name}>
                  {item.component}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    );
  }

}

Header.propTypes = {
  fullScreen: React.PropTypes.bool
};

export default Header;
