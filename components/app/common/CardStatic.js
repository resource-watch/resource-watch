import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { Autobind } from 'es-decorators';

export default class CardStatic extends React.Component {

  @Autobind
  handleClick() {
    const { clickable, route } = this.props;
    if (clickable) {
      Router.pushRoute(route);
    }
  }

  render() {
    const { background, backgroundSize, className, children } = this.props;
    const style = { background, backgroundSize: backgroundSize || 'cover' };
    const classNameObj = classNames({
      'c-card-static': true,
      [className]: className
    });

    return (
      <div
        className={classNameObj}
        style={style}
        onClick={this.handleClick}
        role="link"
        tabIndex="0"
      >
        {children}
      </div>
    );
  }

}

CardStatic.propTypes = {
  children: PropTypes.any.isRequired,
  background: PropTypes.string,
  backgroundSize: PropTypes.any,
  className: PropTypes.any,
  clickable: PropTypes.bool.isRequired,
  route: PropTypes.string
};

CardStatic.defaultProps = {
  children: ''
};
