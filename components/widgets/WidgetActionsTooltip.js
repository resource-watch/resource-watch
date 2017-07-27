import React from 'react';
import PropTypes from 'prop-types';

const WidgetActionsTooltip = (props) => {
  const { toggleTooltip } = props;

  return (
    <div className="c-widget-actions-tooltip">
      <ul>
        <li>
          <a>
            Share/Embed
          </a>
        </li>
        <li>
          <a>
            Add to dashboard
          </a>
        </li>
        <li>
          <a>
            Go to dataset
          </a>
        </li>
      </ul>
    </div>
  );
};

WidgetActionsTooltip.propTypes = {
  toggleTooltip: PropTypes.func.isRequired
};

export default WidgetActionsTooltip;
