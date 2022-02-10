import { useMemo } from 'react';
import classnames from 'classnames';

// types
import type { APIWidgetSpec } from 'types/widget';

const WidgetInfo = ({
  widget,
  className,
}: {
  widget: APIWidgetSpec;
  className?: string;
}): JSX.Element => {
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
                <li key={link.link}>
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
};

export default WidgetInfo;
