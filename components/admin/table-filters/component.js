import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import RadioGroup from 'components/form/RadioGroup';

// utils
import { USER_TYPES, USER_OPTIONS } from './constants.js';

// styles
import './styles.scss';

class FiltersComponent extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    filtersChange: PropTypes.func.isRequired
  };

  static defaultProps = { className: null };

  onOwnerChange = (value) => {
    this.props.filtersChange({ key: 'user.role', value });
  }

  render() {
    const { className } = this.props;
    const classNameValue = classnames({
      'c-filters': true,
      [className]: !!className
    });
    return (
      <div
        className={classNameValue}
      >
        <RadioGroup
          name="owner-filter"
          properties={{ default: USER_TYPES.ADMIN }}
          options={USER_OPTIONS}
          onChange={this.onOwnerChange}
        />
      </div>
    );
  }
}

export default FiltersComponent;
