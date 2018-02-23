import React from 'react';
import PropTypes from 'prop-types';

function LoginModal(props) {
  return (
    <div className="c-login-modal">
      <div className="header-div">
        <h2>Log in to Resource Watch</h2>
        <p>{props.text}</p>
      </div>
      <div className="log-in-container">
        <p>Log in or sign up with...</p>
        <div className="log-in-buttons">
          <a
            className="c-button -b"
            href={`https://production-api.globalforestwatch.org/auth/google?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true`}
          >
            Google
          </a>
          <a
            className="c-button -b"
            href={`https://production-api.globalforestwatch.org/auth/facebook?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true`}
          >
            Facebook
          </a>
          <a
            className="c-button -b"
            href={`https://production-api.globalforestwatch.org/auth/twitter?callbackUrl=${process.env.CALLBACK_URL}&applications=rw&token=true`}
          >
            Twitter
          </a>
        </div>
      </div>
      <div className="buttons">
        <button
          className="c-button -a"
          onClick={() => props.onRequestClose()}
        >
          Ok
        </button>
      </div>
    </div>
  );
}

LoginModal.propTypes = {
  text: PropTypes.string.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

export default LoginModal;
