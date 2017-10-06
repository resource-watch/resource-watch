import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Components
import Title from 'components/ui/Title';

export default class CardApp extends React.Component {
  static propTypes = {
    background: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.object,
    className: PropTypes.any
  };

  static defaultProps = {
    children: ''
  };


  render() {
    const { background, title, description, link, className } = this.props;
    const classNames = classnames({
      'c-card-app': true,
      [className]: className
    });

    return (
      <div
        className={`c-card-app ${classNames}`}
      >
        {!!background &&
          <div
            className="card-background"
            style={{
              background: `url(${background})`
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
            {!!link && link.external &&
              <a
                href={link.route}
                target="_blank"
                className="c-button -secondary -fullwidth"
              >
                {link.label}
              </a>
            }
          </div>
        </div>
      </div>
    );
  }
}
