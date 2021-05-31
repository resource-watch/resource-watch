import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'next/link';

// Components
import Title from 'components/ui/Title';

// Utils
import { logEvent } from 'utils/analytics';

function CardApp({
  background, title, description, link, className, buttonType, logEvent = false,
}) {
  const classNames = classnames({
    [className]: className,
  });

  const buttonClasses = classnames({
    '-secondary': !buttonType,
    '-primary': buttonType && buttonType === 'primary',
  });

  return (
    <div
      className={`c-card-app ${classNames}`}
    >
      {!!(background)
        && (
        <div
          className="card-background"
          style={{
            backgroundImage: `url(${background})`,
          }}
        />
        )}

      <div className="card-container">
        <Title className="-default">
          {title}
        </Title>

        <div className="card-content">
          {description}
        </div>

        <div className="card-footer">
          {!!link && !link.external && (
            <Link href={link.route}>
              <a
                className={`c-button ${buttonClasses} -fullwidth`}
                onClick={() => {
                  if (logEvent) {
                    logEvent('Related app Go to site clicked', title);
                  }
                }}
              >
                {link.label}
              </a>
            </Link>
          )}
          {!!link && link.external && (
            <a
              href={link.route}
              target="_blank"
              className={`c-button ${buttonClasses} -fullwidth`}
              onClick={() => {
                if (logEvent) {
                  logEvent('Related app Go to site clicked', title);
                }
              }}
            >
              {link.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

CardApp.propTypes = {
  background: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.object,
  buttonType: PropTypes.string,
  className: PropTypes.any,
  logEvent: PropTypes.bool,
};

export default CardApp;
