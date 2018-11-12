import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Banner({ styles = {}, overlay, useBackground = true, className, bgImage, viel, children }) {
  const classNamesProps = classNames({ 
    'c-banner': true,
    '-light': true,
    '-use-background': useBackground,
    '-overlay': overlay,
    [className]: className
  });

  if (styles && bgImage) {
    styles.backgroundImage = `url(${bgImage})`;
  }


  return (
    <section
      className={classNamesProps}
      style={styles}
    >
      {viel && <div className="c-viel" />}
      <div className="l-container">
        {children}
      </div>
    </section>
  );
}

Banner.propTypes = {
  bgImage: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  styles: PropTypes.object,
  viel: PropTypes.bool,
  useBackground: PropTypes.bool
};

export default Banner;
