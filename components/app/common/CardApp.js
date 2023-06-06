import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'next/link';

// Components
import Title from 'components/ui/Title';

function CardApp({ background, title, description, link, className, buttonType }) {
  const classNames = classnames({
    [className]: className,
  });

  const buttonClasses = classnames({
    '-secondary': !buttonType,
    '-primary': buttonType && buttonType === 'primary',
  });

  return (
    <div className={`c-card-app ${classNames}`}>
      {!!background && (
        <div
          className="card-background"
          style={{
            backgroundImage: `url(${background})`,
          }}
        />
      )}

      <div className="card-container">
        <Title className="-default">{title}</Title>

        <div className="card-content">{description}</div>

        <div className="card-footer">
          {!!link && !link.external && (
            <Link href={link.route}>
              <a className={`c-button ${buttonClasses} -fullwidth`}>{link.label}</a>
            </Link>
          )}
          {!!link && link.external && (
            <a
              href={link.route}
              target="_blank"
              className={`c-button ${buttonClasses} -fullwidth`}
              rel="noreferrer"
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
};

export default CardApp;
