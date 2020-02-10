import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

// Components
import Icon from 'components/ui/icon';

export default class SearchSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: props.options ? props.options.find(item => item.value === props.value) : null,
      closed: true,
      filteredOptions: props.options || [],
      selectedIndex: 0,
      value: props.value
    };

    // Bindings
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.onType = this.onType.bind(this);
    this.onEnterSearch = this.onEnterSearch.bind(this);
    this.onScreenClick = this.onScreenClick.bind(this);
    this.resetSelectedIndex = this.resetSelectedIndex.bind(this);
  }

  UNSAFE_componentWillReceiveProps({ options, value }) {
    if (!isEqual(this.props.options, options)) {
      this.setState({
        filteredOptions: options,
        selectedItem: options.find(item => item.value === value)
      });
    }
    if (this.props.value !== value) {
      this.setState({ selectedItem: this.props.options.find(item => item.value === value) });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onScreenClick);
  }

  // Event handler for event keyup on search input
  onType(evt) {
    console(evt);
    switch (evt.keyCode) {
      // key up
      case 38: {
        const index = this.state.selectedIndex > 0 ?
          this.state.selectedIndex - 1 :
          this.state.filteredOptions.length - 1;
        this.setSelectedIndex(index);
        break;
      }
      // key down
      case 40: {
        const index = (this.state.selectedIndex < this.state.filteredOptions.length - 1) ?
          this.state.selectedIndex + 1 :
          0;
        this.setSelectedIndex(index);
        break;
      }
      // enter key
      case 13: {
        if (this.state.selectedIndex !== -1 && this.state.filteredOptions.length) {
          const selectedItem = this.state.filteredOptions[this.state.selectedIndex];
          this.resetSelectedIndex();
          this.selectItem(selectedItem);
        }
        break;
      }
      // esc key
      case 27: {
        this.close();
        break;
      }
      // Typing text
      default: {
        const value = evt.currentTarget.value;
        const filteredOptions = this.props.options.filter(item => item.label
          .toLowerCase().match(value.toLowerCase()));
        this.setState({ filteredOptions }, () => {
          if (this.props.onKeyPressed) this.props.onKeyPressed({ value }, [], 'name');
        });
        break;
      }
    }
  }

  // Event handler for enter event on search input
  onEnterSearch() {
    this.setState({ closed: false });
  }

  onScreenClick(evt) {
    if (this.el.contains && !this.el.contains(evt.target)) {
      this.close();
      window.removeEventListener('click', this.onScreenClick);
    }
  }

  setSelectedIndex(index) {
    this.setState({ selectedIndex: index });
  }

  resetSelectedIndex() {
    this.setSelectedIndex(0);
  }

  // Event handler for mouseup event on options list item
  selectItem(item) {
    this.setState({ selectedItem: item });
    this.close();
    if (this.props.onValueChange) this.props.onValueChange(item);
  }

  toggle() {
    return this.state.closed ? this.open() : this.close();
  }

  // Method than shows the option list
  open() {
    // Close select when clicking outside it
    window.addEventListener('click', this.onScreenClick);

    this.setState({ closed: false }, () => {
      if (this.input) this.input.focus();
    });
  }

  // Method that closes the options list
  close() {
    window.removeEventListener('click', this.onScreenClick);

    this.setState({
      closed: true,
      filteredOptions: this.props.options,
      value: this.input.value
    }, this.resetSelectedIndex);
  }

  render() {
    // Class names
    const cNames = ['c-custom-select -search'];
    if (this.props.className) cNames.push(this.props.className);
    if (this.state.closed) cNames.push('-closed');

    const noResults = !!(this.props.options.length && !this.state.filteredOptions.length);

    return (
      <div ref={(node) => { this.el = node; }} className={cNames.join(' ')}>
        <span className="custom-select-text" onClick={this.toggle}>
          <div>
            <span>{ this.state.value ? this.state.value : this.props.placeholder }</span>
            <button className="icon-btn" onClick={this.toggle}>
              <Icon name="icon-search" className="-small" />
            </button>
          </div>
          <input
            ref={(node) => { this.input = node; }}
            className="custom-select-search"
            type="search"
            defaultValue={this.props.value}
            onBlur={this.close}
            onFocus={this.onEnterSearch}
            onChange={this.onType}
          />
        </span>
        {noResults &&
          <span className="no-results">No results</span>
        }
        {!this.state.closed && !this.props.hideList &&
          <ul className="custom-select-options">
            {this.state.filteredOptions.map((item, index) => {
              const cName = (index === this.state.selectedIndex) ? '-selected' : '';
              return (
                <li
                  className={cName}
                  key={item.id || item.label}
                  onMouseEnter={() => { this.setSelectedIndex(index); }}
                  onMouseDown={() => this.selectItem(item)}
                >
                  <span className="label">{item.label}</span>
                </li>
              );
            })}
          </ul>
        }
      </div>
    );
  }
}

SearchSelect.propTypes = {
  options: PropTypes.array,
  hideList: PropTypes.bool,
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onValueChange: PropTypes.func,
  onKeyPressed: PropTypes.func
};
