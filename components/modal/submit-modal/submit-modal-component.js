import React from 'react';
import PropTypes from 'prop-types';

function SubmitModalComponent(props) {
  return (
    <div className="c-submit-modal">
      <div className="row">
        <div className="header-div">
          <h2>{props.header || 'Thank you for your submission.'}</h2>
          <p>{props.text}</p>
        </div>
      </div>
    </div>
  );
}

SubmitModalComponent.propTypes = {
  text: PropTypes.string.isRequired
};

export default SubmitModalComponent;
