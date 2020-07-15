import React from 'react';
import PropTypes from 'prop-types';

// styles
import './styles.scss';

const MaintenanceBanner = ({ timeText, handleMaintenanceBanner }) => (
  <div className="c-gdpr-banner">
    <div className="l-container">
      <div className="row">
        <div className="column small-9 medium-10">
            Resource Watch will be undergoing a bit of scheduled maintenance on {timeText} and some functionality may be
            limited during that period of time. Thanks for your patience!
        </div>
        <div className="column small-3 medium-2">
          <div className="c-button-container -j-end -a-center -full-height">
            <button
              type="button"
              className="c-button -primary -alt -compressed -fs-medium"
              onClick={handleMaintenanceBanner}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

MaintenanceBanner.propTypes = { timeText: PropTypes.string.isRequired };

export default MaintenanceBanner;
