import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'routes';

function Header(props) {
  const { skipAnimation, hideSkip } = props;

  return (
    <div className="c-splash-header">
      <Link route="home">
        <img className="logo" src="/static/images/logo-resource-watch.png" alt="Resource Watch" />
      </Link>
      <div className="links">
        {props.showEarthViewLink &&
        <div className="earth-view-link">
          <Link route="splash">
            <img src="/static/images/splash/globe.svg" alt="Earth view" />
          </Link>
          <Link route="splash">
            <a>EARTH VIEW</a>
          </Link>
        </div>
        }
        {!hideSkip && <button onClick={skipAnimation} className="c-splash-header-skip-intro">SKIP INTRO</button>}
        <Link route="home">
          <a>GO TO SITE</a>
        </Link>
      </div>
    </div>
  );
}

Header.defaultProps = {
  showEarthViewLink: false
};

Header.propTypes = {
  showEarthViewLink: PropTypes.bool,
  skipAnimation: PropTypes.func.isRequired
};

export default Header;
