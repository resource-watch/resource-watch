import { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function WidgetInfo({ widget, className }) {
  const widgetLinks = useMemo(() => widget?.metadata?.[0]?.info?.widgetLinks || [], [widget]);

  return (
    <div
      className={classnames('c-widget-info', {
        [className]: Boolean(className),
      })}
    >
      <div className="widget-info-row">
        {!widget?.description && <p>No additional information is available.</p>}

        {widget?.description && (
          <>
            <h4>Description</h4>
            <p>{widget.description}</p>
          </>
        )}
      </div>

      {widgetLinks.length > 0 && (
        <div className="widget-info-row">
          <div className="widget-links-container">
            <h4>Links</h4>
            <ul>
              {widgetLinks.map((link) => (
                <li>
                  <a href={link.link} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

WidgetInfo.defaultProps = {
  style: {},
};

WidgetInfo.propTypes = {
  widget: PropTypes.shape({
    description: PropTypes.string,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          widgetLinks: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string,
              link: PropTypes.string,
            }),
          ),
        }),
      }),
    ),
  }).isRequired,
  style: PropTypes.shape({}),
};
