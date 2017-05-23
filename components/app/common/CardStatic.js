import React from 'react';
import classNames from 'classnames';

function CardStatic(props) {
  const style = { background: props.background, backgroundSize: props.backgroundSize || 'cover' };
  const className = classNames({
    'c-card-static': true,
    [props.className]: props.className
  });

  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  );
}

CardStatic.propTypes = {
  children: React.PropTypes.any.isRequired,
  background: React.PropTypes.string,
  backgroundSize: React.PropTypes.any,
  className: React.PropTypes.any
};

CardStatic.defaultProps = {
  children: ''
};

export default CardStatic;
