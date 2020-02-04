import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import Checkbox from './Checkbox';

export default class CheckboxGroup extends React.Component {
  constructor(props) {
    super(props);

    // Initial state
    this.state = { checked: this.props.selected || [] };
    // BINDINGS
    this.onChange = this.onChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.selected, this.props.selected)) {
      this.setState({ checked: nextProps.selected });
    }
  }

  /**
   * UI EVENTS
   * - onChange
  */
  onChange(newItem) {
    // Send objects
    const selectedObj = this.props.options.find(option => option.value === newItem.value);
    const newChecked = this.state.checked.slice(0);

    if (newItem.checked) {
      newChecked.push(selectedObj.value);
    } else {
      newChecked.splice(newChecked.indexOf(selectedObj.value), 1);
    }

    this.setState({ checked: newChecked });
    this.props.onChange && this.props.onChange(newChecked);
  }

  getCheckbox() {
    return this.props.options.map((option, i) => (
      <Checkbox
        key={i}
        properties={{
          name: this.props.name,
          title: option.label,
          checked: this.state.checked.includes(option.value),
          value: option.value,
          default: option.value
        }}
        onChange={newSelected => this.onChange(newSelected)}
      />
    ));
  }

  render() {
    const { className } = this.props;

    const customClassName = classnames({ [className]: !!className });

    return (
      <div className={`c-checkbox-box ${customClassName}`}>
        {this.props.title && <span className="checkbox-box-title">{this.props.title}</span>}
        {this.getCheckbox()}
      </div>
    );
  }
}

CheckboxGroup.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  selected: PropTypes.array,
  className: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func
};
