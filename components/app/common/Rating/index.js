import React from 'react';
import PropTypes from 'prop-types';
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
  rating: PropTypes.number,
  className: PropTypes.any
};

export default Rating;
