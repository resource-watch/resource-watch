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
          <h4>Log in or create a free account to access advanced features</h4>
          <p>
            Save your favorite data, create customized collections, and more.
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
