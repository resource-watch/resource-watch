import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const AreaActionsTooltip = (props) => {
  const {
    onMouseDown,
    onRenameArea,
    onChangeVisibility,
    onEditSubscriptions,
    onDeleteArea,
    area,
    showSubscriptions,
    tooltipRef,
  } = props;

  const handleClick = useCallback(
    (action) => {
      switch (action) {
        case 'rename':
          onRenameArea();
          break;
        case 'change-visibility':
          onChangeVisibility();
          break;
        case 'edit_subscriptions':
          onEditSubscriptions();
          break;
        case 'delete_area':
          onDeleteArea();
          break;
        default: {
          throw Error(`Action '${action}' not supported`);
        }
      }

      onMouseDown();
    },
    [onRenameArea, onChangeVisibility, onEditSubscriptions, onDeleteArea, onMouseDown],
  );

  useEffect(() => {
    const triggerMouseDown = (e) => {
      const tooltipDOM = tooltipRef.current;
      const clickOutside = tooltipDOM && !tooltipDOM.contains(e.target);
      if (clickOutside) onMouseDown();
    };

    window.addEventListener('mousedown', triggerMouseDown);

    return () => {
      window.removeEventListener('mousedown', triggerMouseDown);
    };
  }, [onMouseDown, tooltipRef]);

  return (
    <div className="c-area-actions-tooltip">
      <ul>
        <li>
          <button type="button" className="c-button" onClick={() => handleClick('rename')}>
            Rename
          </button>
        </li>
        <li>
          <button
            type="button"
            className="c-button"
            onClick={() => handleClick('change-visibility')}
          >
            {`Make ${area.public ? 'Private' : 'Public'}`}
          </button>
        </li>
        {/**
         * * Enable subscriptions unconditionally when they work properly.
         * * Currently, they are disabled in Explore.
         */}
        {showSubscriptions && (
          <li>
            <button
              type="button"
              className="c-button -desktopOnly"
              onClick={() => handleClick('edit_subscriptions')}
            >
              Edit subscriptions
            </button>
          </li>
        )}
        <li>
          <button type="button" className="c-button" onClick={() => handleClick('delete_area')}>
            Delete area
          </button>
        </li>
      </ul>
    </div>
  );
};

AreaActionsTooltip.propTypes = {
  area: PropTypes.shape({
    name: PropTypes.string.isRequired,
    public: PropTypes.bool.isRequired,
  }).isRequired,
  tooltipRef: PropTypes.shape({
    current: PropTypes.shape({
      contains: PropTypes.func,
    }),
  }).isRequired,
  showSubscriptions: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onRenameArea: PropTypes.func.isRequired,
  onChangeVisibility: PropTypes.func.isRequired,
  onEditSubscriptions: PropTypes.func.isRequired,
  onDeleteArea: PropTypes.func.isRequired,
};

export default AreaActionsTooltip;
