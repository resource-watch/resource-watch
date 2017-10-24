import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Banner(props) {
  const styles = props.styles || {};
  const className = classNames({
    'c-banner': true,
    '-light': true,
    '-use-background': props.useBackground,
    [props.className]: props.className
  });

  if (props.bgImage) {
    styles.backgroundImage = `url(${props.bgImage})`;
  }

  return (
    <section
      className={className}
      style={styles}
    >
      {props.viel && <div className="c-viel" />}
      <div>
        {props.children}
      </div>
    </section>
  );
}

Banner.defaultProps = {
  useBackground: true
};

Banner.propTypes = {
  bgImage: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  styles: PropTypes.object,
  containerGrid: PropTypes.bool,
  viel: PropTypes.bool,
  useBackground: PropTypes.bool
};

export default Banner;
