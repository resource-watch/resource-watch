import React from 'react';

// Components
import LoginRequired from 'components/ui/login-required';

// Styles
import './styles.scss';

function ExploreLogin() {
  return (
    <div className="c-explore-login">
      <div className="card -empty" />
      <LoginRequired>
        <div className="card -login">
          <h4>Log in to start your own data curation</h4>
          <p>
              Make your usual data exploration more agile
              by creating your own dataset collections.
          </p>
          <button className="c-button -primary -compressed">
                        Log in
          </button>
        </div>
      </LoginRequired>
      <div className="card -empty" />
      <div className="card -empty" />
    </div>
  );
}

export default ExploreLogin;
