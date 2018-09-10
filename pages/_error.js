import React from 'react';
import HeadNext from 'next/head';
import { Link } from 'routes';
import PropTypes from 'prop-types';

// Utils
import { initGA, logPageView } from 'utils/analytics';

class Error extends React.Component {
  componentDidMount() {
    // Google Analytics
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }
  render() {
    return (
      <div className="p-error">
        <HeadNext>
          <link rel="stylesheet" type="text/css" href="/_next/static/style.css" />;
        </HeadNext>
        <div className="container">
          <h1>404</h1>
          <p>This page could not be found</p>
          <Link route="home">
            <a
              className="c-button -a"
            >
              Go to Resource Watch
            </a>
          </Link>
        </div>
      </div>
    );
  }
}

export default Error;
