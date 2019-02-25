import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Global styles
import 'css/index.scss';

// components
import ErrorHead from 'layout/head/error';

// utils
import { initGA, logPageView } from 'utils/analytics';

class Error extends PureComponent {
  static propTypes = { statusCode: PropTypes.number }

  static defaultProps = { statusCode: 404 }

  static async getInitialProps(context) {
    const { res } = context;

    return { ...res && { statusCode: res.statusCode } };
  }

  componentDidMount() {
    // Google Analytics
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  render() {
    const { statusCode } = this.props;

    return (
      <div
        id="#main"
        className="l-error"
      >
        <ErrorHead statusCode={statusCode} />
        <div className="container">
          <h1>{statusCode}</h1>
          <p>This page could not be found</p>
          <Link route="home">
            <a className="c-button -a">
              Go to Resource Watch
            </a>
          </Link>
        </div>
      </div>
    );
  }
}

export default Error;
