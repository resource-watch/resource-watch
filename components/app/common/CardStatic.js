import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

class CardStatic extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    background: PropTypes.string,
    backgroundSize: PropTypes.any,
    className: PropTypes.any,
    clickable: PropTypes.bool.isRequired,
    route: PropTypes.string,
    anchor: PropTypes.bool,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = { children: '' };

  constructor(props) {
    super(props);

    // ------------------- Bindings -----------------------
    this.handleClick = this.handleClick.bind(this);
    // ----------------------------------------------------
  }

  handleClick(event) {
    const {
      clickable,
      route,
      anchor,
      router,
    } = this.props;
    if (!anchor && clickable && event.target.tagName !== 'A') {
      router.push(route);
    }

    if (anchor && clickable && event.target.tagName !== 'A') {
      window.location = route;
    }
  }

  render() {
    const {
      background, backgroundSize, className, children,
    } = this.props;
    const style = { background, backgroundSize: backgroundSize || 'cover' };
    const classNameObj = classNames({
      'c-card-static': true,
      [className]: className,
    });

    return (
      <div className="c-card-static-box">
        <div
          className={classNameObj}
          style={style}
          onClick={this.handleClick}
          role="link"
          tabIndex="0"
        >
          {children}
        </div>
      </div>
    );
  }
}

export default withRouter(CardStatic);
