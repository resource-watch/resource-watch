import React from 'react';
import HeadNext from 'next/head';
import { Link } from 'routes';

function Error (props) {
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

export default Error;
