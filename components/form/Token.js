import React from 'react';
import TokenInput, { Option } from 'react-tokeninput';
import without from 'lodash/without';
import uniq from 'lodash/uniq';

import FormElement from './FormElement';

class Token extends FormElement {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.properties.default,
      items: this.props.options || [],
      options: this.props.options || [],
      selected: this.props.properties.default.map((s) => {
        return { id: s, name: s };
      }),
      valid: null,
      error: []
    };

    this.triggerSelected = this.triggerSelected.bind(this);
    this.triggerRemove = this.triggerRemove.bind(this);
    this.triggerInput = this.triggerInput.bind(this);
  }

  /**
   * HELPERS
   * - getSlug
  */
  getSlug(string) {
    let st = string;
    st = st.toLowerCase();
    st = st.replace(/[\u00C0-\u00C5]/ig, 'a');
    st = st.replace(/[\u00C8-\u00CB]/ig, 'e');
    st = st.replace(/[\u00CC-\u00CF]/ig, 'i');
    st = st.replace(/[\u00D2-\u00D6]/ig, 'o');
    st = st.replace(/[\u00D9-\u00DC]/ig, 'u');
    st = st.replace(/[\u00D1]/ig, 'n');
    st = st.trim().replace(/ /g, '-');
    st = st.replace(/[^\w\s-]/g, '');
    return st;
  }

  /**
   * UI EVENTS
   * - triggerRemove
   * - triggerSelected
   * - triggerInput
   * - triggerChange
  */

  triggerRemove(value) {
    const selectedOptions = uniq(without(this.state.selected, value));
    this.triggerChange(selectedOptions);
  }

  triggerSelected(value) {
    let newVal = value;
    if (typeof value === 'string') {
      newVal = { id: this.getSlug(value), name: this.getSlug(value) };
    }

    const selectedOptions = uniq(this.state.selected.concat([newVal]));
    this.setState({
      selectedToken: null
    });

    this.triggerChange(selectedOptions);
  }

  triggerInput(userInput) {
    this.setState({
      input: userInput,
      loading: true,
      options: []
    });

    setTimeout(() => {
      this.filterOptions(this.state.input);
      this.setState({
        loading: false
      });
    }, 500);
  }

  filterOptions(userInput) {
    const { items } = this.state;
    // If the user doesn't write anything return all the options
    if (userInput === '') {
      return this.setState({ options: [] });
    }

    // Define a RegExp
    const regExp = new RegExp('^' + userInput, 'i');

    const filteredNames = items.filter(option =>
      regExp.test(option.label) || regExp.test(option.value)
    );

    return this.setState({ options: filteredNames });
  }

  triggerChange(selected) {
    this.setState({ selected, value: selected.map(s => s.id) }, () => {
      // Trigger validation
      this.triggerValidate();
      // Publish the new value to the form
      if (this.props.onChange) this.props.onChange(this.state.value);
    });
  }

  renderComboboxOptions() {
    const { options } = this.state;
    return options.map(option =>
      <Option
        key={option.value}
        value={option.label}
      >
        {option.label}
      </Option>
    );
  }

  render() {
    const { properties } = this.props;
    const { selected, items } = this.state;

    const menuContent = items.length ?
      this.renderComboboxOptions() : [];

    return (
      <TokenInput
        {...properties}
        id={`select-${properties.name}`}
        menuContent={menuContent}
        selected={selected}
        onChange={this.triggerChange}
        onSelect={this.triggerSelected}
        onRemove={this.triggerRemove}
        onInput={this.triggerInput}
        placeholder="Enter tokens here"
      />
    );
  }
}

Token.propTypes = {
  properties: React.PropTypes.object.isRequired,
  options: React.PropTypes.array,
  hint: React.PropTypes.string,
  validations: React.PropTypes.array,
  onChange: React.PropTypes.func
};

export default Token;
