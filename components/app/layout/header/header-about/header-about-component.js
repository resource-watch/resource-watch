import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import TetherComponent from 'react-tether';

export default function HeaderAbout(props) {
  return (
    <TetherComponent
      attachment="top center"
      constraints={[{
        to: 'window'
      }]}
      targetOffset="0 0"
      classes={{
        element: 'c-header-dropdown'
      }}
    >
      {/* First child: This is what the item will be tethered to */}
      <Link route="about" >
        <a
          onMouseEnter={() => props.setDropdownOpened({ about: true })}
          onMouseLeave={() => props.setDropdownOpened({ about: false })}
        >
          About
        </a>
      </Link>
      {/* Second child: If present, this item will be tethered to the the first child */}
      {props.header.dropdownOpened.about &&
        <ul
          className="header-dropdown-list"
          onMouseEnter={() => props.setDropdownOpened({ about: true })}
          onMouseLeave={() => props.setDropdownOpened({ about: false })}
        >
          <li className="header-dropdown-list-item">
            <Link route="about_partners">
              <a>Partners</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="about_faqs">
              <a>FAQs</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="about_howto">
              <a>How to</a>
            </Link>
          </li>

          <li className="header-dropdown-list-item">
            <Link route="about_contact-us">
              <a>Contact us</a>
            </Link>
          </li>
        </ul>
      }
    </TetherComponent>
  );
}

HeaderAbout.propTypes = {
  header: PropTypes.object,
  setDropdownOpened: PropTypes.func
};
