import React from 'react';
import { Link } from 'routes';

// Components
import Logo from 'components/app/layout/Logo';
import Menu from 'components/ui/Menu';
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
    this.toggleDataDropdown = this.toggleDataDropdown.bind(this);
    this.onScreenClick = this.onScreenClick.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onScreenClick);
  }

  onScreenClick(e) {

    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    const isDataBtn = this.dataDropdownBtn.contains(e.target);
    const isAboutBtn = this.aboutDropdownBtn.contains(e.target);

    if (clickOutside) {
      if (!isDataBtn) this.toggleDataDropdown(e, 'dataDropdownActive', false);
      if (!isAboutBtn) this.toggleDataDropdown(e, 'aboutDropdownActive', false);
    }
  }

  toggleDataDropdown(e, specificDropdown, to) {
    this.setState({
      [specificDropdown]: to
    });

    requestAnimationFrame(() => {
      window[!to ?
        'removeEventListener' : 'addEventListener']('click', this.onScreenClick, true);
    });
  }

  render() {
    const dataDropDown = (
      <TetherComponent
        attachment="top right"
        constraints={[{
          to: 'window'
        }]}
        targetOffset="0px 100%"
        classes={{
          element: 'c-tooltip -arrow-right -menu'
        }}
      >
        {/* First child: This is what the item will be tethered to */}
        <a // eslint-disable-line jsx-a11y/no-static-element-interactions
          ref={(c) => { this.dataDropdownBtn = c; }}
          role="link"
          onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', !this.state.dataDropdownActive)}
        >
          Data
        </a>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.state.dataDropdownActive &&
          <ul className="data-dropdown">
            <li>
              <Link
                route="explore"
                onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', false)}
              >
                <a>Explore Datasets</a>
              </Link>
            </li>
            <li>
              <Link
                route="dashboards"
                onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', false)}
              >
                <a>Dashboards</a>
              </Link>
            </li>
            <li>
              <Link
                route="pulse"
                onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', false)}
              >
                <a>Planet Pulse</a>
              </Link>
            </li>
            <li>
              <Link
                route="get_involved"
                onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', false)}
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
        attachment="top right"
        constraints={[{
          to: 'window'
        }]}
        targetOffset="0px 100%"
        classes={{
          element: 'c-tooltip -arrow-right -menu'
        }}
      >
        {/* First child: This is what the item will be tethered to */}
        <a // eslint-disable-line jsx-a11y/no-static-element-interactions
          ref={(c) => { this.aboutDropdownBtn = c; }}
          role="link"
          onClick={e => this.toggleDataDropdown(e, 'aboutDropdownActive', !this.state.aboutDropdownActive)}
        >
          About
        </a>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.state.aboutDropdownActive &&
          <ul
            className="data-dropdown"
          >
            <li>
              <Link
                route="about"
                onClick={e => this.toggleDataDropdown(e, 'aboutDropdownActive', false)}
              >
                <a>About</a>
              </Link>
            </li>
            <li>
              <Link
                route="about_partners"
                onClick={e => this.toggleDataDropdown(e, 'aboutDropdownActive', false)}
              >
                <a>Partners</a>
              </Link>
            </li>
          </ul>
        }
      </TetherComponent>
      );

    const navigationLinks = [
      { name: dataDropDown },
      { name: <a href="/insights">Insights</a> },
      { name: aboutDropDown },
      { name: <Link route="get_involved"><a>Get Involved</a></Link> },
      { name: <Link route="myrw_editprofile"><a>My RW</a></Link> }
    ];

    const mainClass = this.props.fullScreen ? '-fullScreen' : '';

    return (
      <header className="c-header">
        <div className="header-secondary">
          {/* Language selector */}
        </div>
        <div className={`header-main ${mainClass}`}>
          <div className="brand">
            <Link route="home"><a><Logo /></a></Link>
          </div>
          <div className="menu">
            <Menu items={navigationLinks} />
          </div>
        </div>
      </header>
    );
  }

}

Header.propTypes = {
  fullScreen: React.PropTypes.bool
};

export default Header;
