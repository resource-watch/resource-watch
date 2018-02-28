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
                href={`https://production-api.globalforestwatch.org/auth/google?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true`}
              >
                Google
              </a>
            </div>
            <div className="column small-12 medium-4">
              <a
                className="c-button -facebook -fullwidth"
                href={`https://production-api.globalforestwatch.org/auth/facebook?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true`}
              >
                Facebook
              </a>
            </div>
            <div className="column small-12 medium-4">
              <a
                className="c-button -twitter -fullwidth"
                href={`https://production-api.globalforestwatch.org/auth/twitter?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true`}
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
