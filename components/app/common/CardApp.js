import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Components
import Title from 'components/ui/Title';

// Utils
import { logEvent } from 'utils/analytics';

function CardApp(props) {
  const {
    background, title, description, link, className, buttonType
  } = props;

  const classNames = classnames({
    [className]: className
  });

  const buttonClasses = classnames({
    '-secondary': !buttonType,
    '-primary': buttonType && buttonType === 'primary'
  });

  return (
    <div
      className={`c-card-app ${classNames}`}
    >
      {!!background &&
        <div
          className="card-background"
          style={{
            backgroundImage: `url(${background})`
          }}
        />
      }

      <div className="card-container">
        <Title className="-default">
          {title}
        </Title>

        <div className="card-content">
          {description}
        </div>

        <div className="card-footer">
          {!!link &&
            <a
              href={link.route}
              target={(!!link.external && '_blank') || '_self'}
              className={`c-button ${buttonClasses} -fullwidth`}
              onClick={() => {
                if (props.logEvent) {
                  logEvent('Related app Go to site clicked', title);
                }
              }}
            >
              {link.label}
            </a>
          }
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
  logEvent: PropTypes.bool
};

CardApp.defaultProps = {
  children: '',
  logEvent: false
};

export default CardApp;
