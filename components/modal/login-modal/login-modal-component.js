import React from 'react';
import PropTypes from 'prop-types';

function LoginModal(props) {
  return (
    <div className="c-login-modal">
      <div className="row">
        <div className="header-div">
          <h2>Log in to Resource Watch</h2>
          <p>{props.text || 'Log in or sign up with...'}</p>
        </div>
        <div className="log-in-container">
          <div className="row">
            <div className="column small-12 medium-4">
              <a
                className="c-button -google -fullwidth"
                href="/auth/google"
              >
                Google
              </a>
            </div>
            <div className="column small-12 medium-4">
              <a
                className="c-button -facebook -fullwidth"
                href="/auth/facebook"
              >
                Facebook
              </a>
            </div>
            <div className="column small-12 medium-4">
              <a
                className="c-button -twitter -fullwidth"
                href="/auth/twitter"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginModal.propTypes = {
  text: PropTypes.string.isRequired
};

export default LoginModal;
