import React from 'react';
import PropTypes from 'prop-types';

// util
import { setGDPRAccepted } from 'utils/gdpr';

// styles
import './styles.scss';

function GDPRBannerComponent(props) {
  return (
    <div className="gdpr-banner">
      <div className="l-container">
        <div className="row">
          <div className="column small-10">
            <div>
              This website uses cookies to provide you with an improved user experience. By
              continuing to browse this site, you consent to the use of cookies and similar
              technologies. Please visit our{' '}
              <a
                href="https://resourcewatch.org/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>{' '}
              for further details.
            </div>
          </div>
          <div className="column small-2 button-container">
            <button
              className="c-button -secondary -compressed"
              onClick={() => {
                setGDPRAccepted(true);
                props.onAccept();
              }}
            >
              I agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

GDPRBannerComponent.propTypes = { onAccept: PropTypes.func.isRequired };

export default GDPRBannerComponent;
