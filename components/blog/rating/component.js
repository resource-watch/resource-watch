import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';

// styles
import './styles.scss';

class Rating extends PureComponent {
  static propTypes = {
    rating: PropTypes.number.isRequired,
    className: PropTypes.any
  }

  static defaultProps = { className: null }

  render() {
    const { className, rating } = this.props;
    const componentClass = classnames('c-rating', { [className]: !!className });

    return (
      <div className={componentClass}>
        <Icon
          name="icon-star-full"
          className="-small icon-star-full rating-star"
        />
        <span>{rating}</span>
      </div>
    );
  }
}

export default Rating;
