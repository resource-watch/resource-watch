import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// styles
import './styles.scss';

const GDPRBanner = ({ handleGDPR }) => (
  <div className="c-gdpr-banner">
    <div className="l-container">
      <div className="row">
        <div className="column small-9 medium-10">
          This website uses cookies to provide you with an improved user experience. By
          continuing to browse this site, you consent to the use of cookies and similar
          technologies. Please visit our{' '}
          <Link route="privacy-policy">
            <a
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy policy
            </a>
          </Link>{' '}
          for further details.
        </div>
        <div className="column small-3 medium-2">
          <div className="c-button-container -j-end -a-center -full-height">
            <button
              type="button"
              className="c-button -primary -alt -compressed -fs-medium"
              onClick={handleGDPR}
            >
              I agree
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

GDPRBanner.propTypes = { handleGDPR: PropTypes.func.isRequired };

export default GDPRBanner;
