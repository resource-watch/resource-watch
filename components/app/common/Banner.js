import React from 'react';
import classNames from 'classnames';

function Banner(props) {
  const styles = props.styles || {};
  const className = classNames({
    'c-banner': true,
    '-light': true,
    [props.className]: props.className
  });

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

Banner.propTypes = {
  children: React.PropTypes.any,
  className: React.PropTypes.string,
  styles: React.PropTypes.object,
  containerGrid: React.PropTypes.bool,
  viel: React.PropTypes.bool
};

export default Banner;
