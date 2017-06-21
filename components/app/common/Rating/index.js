import React from 'react';
import classnames from 'classnames';
import Icon from 'components/ui/Icon';

function Rating(props) {
  const className = classnames({
    'c-rating': true,
    [props.className]: props.className
  });

  return (
    <div className={className}>
      <Icon name="icon-star-full" className="-small icon-star-full" />
      <span>{props.rating}</span>
    </div>
  );
}

Rating.propTypes = {
  rating: React.PropTypes.number,
  className: React.PropTypes.any
};

export default Rating;
