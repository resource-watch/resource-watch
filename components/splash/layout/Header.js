import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'routes';

function Header(props) {
  return (
    <div className="c-splash-header">
      <Link route="home">
        <img className="logo" src="/static/images/logo-resource-watch.png" alt="Resource Watch" />
      </Link>
      <div className="links">
        <div className="earth-view-link">
          <Link route="splash">
            <img src="/static/images/splash/globe.svg" alt="Earth view" />
          </Link>
          {props.showEarthViewLink &&
            <Link route="splash">
              <a>EARTH VIEW</a>
            </Link>
          }
        </div>
        <Link route="home">
          <a>GO TO RESOURCE WATCH</a>
        </Link>
      </div>
    </div>
  );
};

Header.defaultProps = {
  showEarthViewLink: false
};

Header.propTypes = {
  showEarthViewLink: PropTypes.boolean
};

export default Header;
