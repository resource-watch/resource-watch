import React from 'react';
import HeadNext from 'next/head';
import { Link } from 'routes';
import PropTypes from 'prop-types';

// Utils
import { logEvent } from 'utils/analytics';

function Error(props) {
  // log url requested
  logEvent('404 page', props.url.pathname);
  return (
    <div className="p-error">
      <HeadNext>
        <style dangerouslySetInnerHTML={{ __html: require('css/index.scss') }} />
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

Error.propTypes = {
  url: PropTypes.object.isRequired
};

export default Error;
