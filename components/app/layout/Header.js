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
      (!isDataBtn) ? this.toggleDataDropdown(e, 'dataDropdownActive', false) : null;
      (!isAboutBtn) ? this.toggleDataDropdown(e, 'aboutDropdownActive', false) : null;
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
        <a
          ref={c => this.dataDropdownBtn = c}
          onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', !this.state.dataDropdownActive)}
        >
          Data
        </a>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.state.dataDropdownActive &&
          <ul className="data-dropdown">
            <li>
              <Link
                to="/explore"
                onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', false)}
              >
                Explore Datasets
              </Link>
            </li>
            <li>
              <a
                href="/countries"
                onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', false)}
              >
                Dashboards
              </a>
            </li>
            <li>
              <Link
                to="/planet-pulse"
                onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', false)}
              >
                Planet Pulse
              </Link>
            </li>
            <li>
              <Link
                to="/get-involved/apps"
                onClick={e => this.toggleDataDropdown(e, 'dataDropdownActive', false)}
              >
                Explore Tools
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
        <a
          ref={c => this.aboutDropdownBtn = c}
          onClick={e => this.toggleDataDropdown(e, 'aboutDropdownActive', !this.state.aboutDropdownActive)} >
          About
        </a>
        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.state.aboutDropdownActive &&
          <ul
            className="data-dropdown"
          >
            <li>
              <Link
                to="/about"
                onClick={e => this.toggleDataDropdown(e, 'aboutDropdownActive', false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/about/partners"
                onClick={e => this.toggleDataDropdown(e, 'aboutDropdownActive', false)}
              >
                Partners
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
      { name: 'Get Involved', path: '/get-involved' }
    ];

    const mainClass = this.props.fullScreen ? '-fullScreen' : '';

    return (
      <header className="c-header">
        <div className="header-secondary">
          {/* Language selector */}
        </div>
        <div className={`header-main ${mainClass}`}>
          <div className="brand">
            <Link to="/"><Logo /></Link>
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
